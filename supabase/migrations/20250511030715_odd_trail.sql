/*
  # Initial Schema Setup

  1. New Tables
    - `establishments`: Stores establishment information
      - `id` (uuid, primary key)
      - `owner_id` (uuid, references auth.users)
      - `name` (text)
      - `description` (text, optional)
      - `slug` (text, unique)
      - Various other fields for establishment details
    
    - `establishment_clients`: Links clients to establishments
      - `id` (uuid, primary key)
      - `establishment_id` (uuid, references establishments)
      - `client_id` (uuid, references auth.users)
      - `status` (text: active/blocked)
    
    - `invites`: Manages establishment invites
      - `id` (uuid, primary key)
      - `establishment_id` (uuid, references establishments)
      - `type` (text: email/phone)
      - `email`/`phone` (text, conditional)
      - `status` (text: pending/accepted/expired)
      - `code` (text)
      - `expires_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for CEO, owners, and clients
    - Implement proper cascading deletes
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

-- Enable RLS
DO $$ 
BEGIN
  ALTER TABLE establishments ENABLE ROW LEVEL SECURITY;
  ALTER TABLE establishment_clients ENABLE ROW LEVEL SECURITY;
  ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
EXCEPTION 
  WHEN others THEN NULL;
END $$;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "CEO can manage all establishments" ON establishments;
  DROP POLICY IF EXISTS "Owners can view and update their establishments" ON establishments;
  DROP POLICY IF EXISTS "Clients can view associated establishments" ON establishments;
  DROP POLICY IF EXISTS "CEO and owners can manage clients" ON establishment_clients;
  DROP POLICY IF EXISTS "Clients can view their relationships" ON establishment_clients;
  DROP POLICY IF EXISTS "CEO and owners can manage invites" ON invites;
EXCEPTION 
  WHEN others THEN NULL;
END $$;

-- Create policies for establishments
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

-- Create policies for establishment_clients
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

-- Create policies for invites
CREATE POLICY "CEO and owners can manage invites" ON invites
  FOR ALL
  TO public
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'ceo'
    UNION
    SELECT owner_id FROM establishments WHERE id = invites.establishment_id
  ));

-- Create or replace function to update appointments count
CREATE OR REPLACE FUNCTION update_appointments_count()
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