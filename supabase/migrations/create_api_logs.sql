/*
  # Create api_logs table

  1. New Tables
    - `api_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `endpoint` (text)
      - `status_code` (integer)
      - `response_time_ms` (integer)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `api_logs` table
    - Add policy for users to view their own logs
    - Add policy for admins to view all logs
*/

CREATE TABLE IF NOT EXISTS api_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  endpoint text NOT NULL,
  status_code integer,
  response_time_ms integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for own logs" 
  ON api_logs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Enable read access for admins"
  ON api_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM user_roles 
    WHERE role = 'admin'
  ));