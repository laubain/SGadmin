/*
  # Create user_roles table

  1. New Tables
    - `user_roles`
      - `user_id` (uuid, references users)
      - `role` (text)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `user_roles` table
    - Add policy for admins to manage roles
    - Add policy for users to view their own roles
*/

CREATE TABLE IF NOT EXISTS user_roles (
  user_id uuid NOT NULL REFERENCES auth.users(id),
  role text NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, role)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for own roles" 
  ON user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Enable all access for admins"
  ON user_roles
  FOR ALL
  TO authenticated
  USING (auth.role() = 'admin');