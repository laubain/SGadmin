/*
  # Create betting_types table

  1. New Tables
    - `betting_types`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `slug` (text, unique, required)
      - `description` (text)
      - `input_schema` (jsonb)
      - `default_prompt_template` (text)
      - `output_type` (text)
      - `category` (text)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `betting_types`
    - Add policy for admin access only
*/

CREATE TABLE IF NOT EXISTS betting_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  input_schema jsonb,
  default_prompt_template text,
  output_type text,
  category text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE betting_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage betting types" 
  ON betting_types
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  ));
