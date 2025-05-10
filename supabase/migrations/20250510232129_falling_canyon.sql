/*
  # Initial Schema Setup

  1. New Tables
    - `establishments` - Core establishment data with URL slug
    - `establishment_clients` - Links clients to establishments
    - `invites` - Manages pending invitations
    
  2. Security
    - RLS policies for each table
    - Secure access patterns
*/

-- Create establishments table if not exists
CREATE TABLE IF NOT EXISTS establishments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  description text,
  slug text NOT NULL UNIQUE,
  address text,
  phone text,
  logo_url text,
  is_premium boolean DEFAULT false,
  appointments_count integer DEFAULT 0,
  cancellation_policy text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create establishment_clients table if not exists
CREATE TABLE IF NOT EXISTS establishment_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id uuid REFERENCES establishments(id) ON DELETE CASCADE,
  client_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  UNIQUE(establishment_id, client_id),
  CONSTRAINT establishment_clients_status_check CHECK (status IN ('active', 'blocked'))
);

-- Create invites table if not exists
CREATE TABLE IF NOT EXISTS invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id uuid REFERENCES establishments(id) ON DELETE CASCADE,
  type text NOT NULL,
  email text,
  phone text,
  status text NOT NULL DEFAULT 'pending',
  code text NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT invites_status_check CHECK (status IN ('pending', 'accepted', 'expired')),
  CONSTRAINT invites_type_check CHECK (type IN ('email', 'phone')),
  CONSTRAINT invite_contact_check CHECK (
    (type = 'email' AND email IS NOT NULL) OR
    (type = 'phone' AND phone IS NOT NULL)
  )
);

-- Function to update appointments count if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_appointments_count') THEN
    CREATE FUNCTION update_appointments_count()
    RETURNS TRIGGER AS $$
    BEGIN
      IF TG_OP = 'INSERT' THEN
        UPDATE establishments 
        SET appointments_count = appointments_count + 1
        WHERE id = NEW.establishment_id;
      ELSIF TG_OP = 'DELETE' THEN
        UPDATE establishments 
        SET appointments_count = appointments_count - 1
        WHERE id = OLD.establishment_id;
      END IF;
      RETURN NULL;
    END;
    $$ LANGUAGE plpgsql;
  END IF;
END $$;

-- Enable RLS
DO $$ 
BEGIN
  -- Enable RLS for each table
  ALTER TABLE IF EXISTS establishments ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS establishment_clients ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS invites ENABLE ROW LEVEL SECURITY;

  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "CEO can manage all establishments" ON establishments;
  DROP POLICY IF EXISTS "Owners can view and update their establishments" ON establishments;
  DROP POLICY IF EXISTS "Clients can view associated establishments" ON establishments;
  DROP POLICY IF EXISTS "CEO and owners can manage clients" ON establishment_clients;
  DROP POLICY IF EXISTS "Clients can view their relationships" ON establishment_clients;
  DROP POLICY IF EXISTS "CEO and owners can manage invites" ON invites;

  -- Create new policies
  CREATE POLICY "CEO can manage all establishments" ON establishments
    FOR ALL
    TO public
    USING (auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'ceo'
    ));

  CREATE POLICY "Owners can view and update their establishments" ON establishments
    FOR ALL
    TO public
    USING (owner_id = auth.uid());

  CREATE POLICY "Clients can view associated establishments" ON establishments
    FOR SELECT
    TO public
    USING (EXISTS (
      SELECT 1 FROM establishment_clients
      WHERE establishment_clients.establishment_id = establishments.id
      AND establishment_clients.client_id = auth.uid()
      AND establishment_clients.status = 'active'
    ));

  CREATE POLICY "CEO and owners can manage clients" ON establishment_clients
    FOR ALL
    TO public
    USING (auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'ceo'
      UNION
      SELECT owner_id FROM establishments WHERE id = establishment_clients.establishment_id
    ));

  CREATE POLICY "Clients can view their relationships" ON establishment_clients
    FOR SELECT
    TO public
    USING (client_id = auth.uid());

  CREATE POLICY "CEO and owners can manage invites" ON invites
    FOR ALL
    TO public
    USING (auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'ceo'
      UNION
      SELECT owner_id FROM establishments WHERE id = invites.establishment_id
    ));
END $$;