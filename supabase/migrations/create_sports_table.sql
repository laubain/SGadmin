/*
  # Create sports table

  1. New Tables
    - `sports`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `slug` (text, unique, required)
      - `icon_url` (text)
      - `status` (boolean, default true)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `sports`
    - Add policy for admin access only
*/

CREATE TABLE IF NOT EXISTS sports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon_url text,
  status boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage sports" 
  ON sports
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  ));
