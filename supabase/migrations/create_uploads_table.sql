/*
  # Create uploads table

  1. New Tables
    - `uploads`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `file_name` (text)
      - `file_size` (integer)
      - `file_type` (text)
      - `storage_path` (text)
      - `status` (text)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `uploads` table
    - Add policy for users to manage their own uploads
    - Add policy for admins to manage all uploads
*/

CREATE TABLE IF NOT EXISTS uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  file_name text NOT NULL,
  file_size integer NOT NULL,
  file_type text NOT NULL,
  storage_path text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for own uploads" 
  ON uploads
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Enable all access for admins"
  ON uploads
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM user_roles 
    WHERE role = 'admin'
  ));