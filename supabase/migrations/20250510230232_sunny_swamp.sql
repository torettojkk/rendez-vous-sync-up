/*
  # Initial Schema Setup

  1. New Tables
    - `establishments`
      - Core establishment data
      - Includes URL slug and settings
    - `establishment_clients` 
      - Links clients to establishments
      - Tracks relationship status
    - `invites`
      - Manages pending invitations
      - Tracks invite status and type
    - `services`
      - Services offered by establishments
    - `available_hours`
      - Establishment operating hours
    - `appointments`
      - Appointment bookings and status
    
  2. Security
    - RLS policies for each table
    - Secure access patterns
    
  3. Functions
    - Generate unique slugs
    - Handle invite acceptance
*/

-- Establishments table
CREATE TABLE establishments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  description text,
  slug text UNIQUE NOT NULL,
  address text,
  phone text,
  logo_url text,
  is_premium boolean DEFAULT false,
  appointments_count integer DEFAULT 0,
  cancellation_policy text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Function to generate unique slug
CREATE OR REPLACE FUNCTION generate_unique_slug(establishment_name text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 1;
BEGIN
  -- Create base slug from name
  base_slug := lower(regexp_replace(establishment_name, '[^a-zA-Z0-9]+', '-', 'g'));
  final_slug := base_slug;
  
  -- Check if slug exists and append number if needed
  WHILE EXISTS (SELECT 1 FROM establishments WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter::text;
  END LOOP;
  
  RETURN final_slug;
END;
$$;

-- Establishment-Client relationships
CREATE TABLE establishment_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id uuid REFERENCES establishments(id) ON DELETE CASCADE,
  client_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('active', 'blocked')) DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  UNIQUE(establishment_id, client_id)
);

-- Invites table
CREATE TABLE invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id uuid REFERENCES establishments(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('email', 'phone')),
  email text,
  phone text,
  status text NOT NULL CHECK (status IN ('pending', 'accepted', 'expired')) DEFAULT 'pending',
  code text NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT invite_contact_check CHECK (
    (type = 'email' AND email IS NOT NULL) OR
    (type = 'phone' AND phone IS NOT NULL)
  )
);

-- Services table
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id uuid REFERENCES establishments(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  duration integer NOT NULL CHECK (duration >= 15),
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Available hours table
CREATE TABLE available_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id uuid REFERENCES establishments(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  interval_minutes integer NOT NULL CHECK (interval_minutes >= 15),
  UNIQUE(establishment_id, day_of_week)
);

-- Appointments table
CREATE TABLE appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id uuid REFERENCES establishments(id) ON DELETE CASCADE,
  client_id uuid REFERENCES auth.users(id),
  service_id uuid REFERENCES services(id),
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE establishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE establishment_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE available_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Establishments
CREATE POLICY "CEO can manage all establishments" ON establishments
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'ceo'
    )
  );

CREATE POLICY "Owners can view and update their establishments" ON establishments
  FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Clients can view associated establishments" ON establishments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM establishment_clients
      WHERE establishment_id = establishments.id
      AND client_id = auth.uid()
      AND status = 'active'
    )
  );

-- Establishment Clients
CREATE POLICY "CEO and owners can manage clients" ON establishment_clients
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'ceo'
      UNION
      SELECT owner_id FROM establishments WHERE id = establishment_clients.establishment_id
    )
  );

CREATE POLICY "Clients can view their relationships" ON establishment_clients
  FOR SELECT USING (client_id = auth.uid());

-- Services
CREATE POLICY "CEO and owners can manage services" ON services
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'ceo'
      UNION
      SELECT owner_id FROM establishments WHERE id = services.establishment_id
    )
  );

CREATE POLICY "Anyone can view active services" ON services
  FOR SELECT USING (is_active = true);

-- Available Hours
CREATE POLICY "CEO and owners can manage hours" ON available_hours
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'ceo'
      UNION
      SELECT owner_id FROM establishments WHERE id = available_hours.establishment_id
    )
  );

CREATE POLICY "Anyone can view available hours" ON available_hours
  FOR SELECT USING (true);

-- Appointments
CREATE POLICY "CEO and owners can manage all appointments" ON appointments
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'ceo'
      UNION
      SELECT owner_id FROM establishments WHERE id = appointments.establishment_id
    )
  );

CREATE POLICY "Clients can manage their appointments" ON appointments
  FOR ALL USING (client_id = auth.uid());

-- Invites
CREATE POLICY "CEO and owners can manage invites" ON invites
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'ceo'
      UNION
      SELECT owner_id FROM establishments WHERE id = invites.establishment_id
    )
  );

-- Trigger to update establishments count
CREATE OR REPLACE FUNCTION update_appointments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE establishments 
    SET appointments_count = appointments_count + 1
    WHERE id = NEW.establishment_id;
  ELSIF TG_OP = 'DELETE' AND OLD.status != 'cancelled' THEN
    UPDATE establishments 
    SET appointments_count = appointments_count - 1
    WHERE id = OLD.establishment_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER appointments_count_trigger
AFTER INSERT OR DELETE ON appointments
FOR EACH ROW
EXECUTE FUNCTION update_appointments_count();