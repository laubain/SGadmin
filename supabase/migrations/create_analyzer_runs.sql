/*
  # Create analyzer_runs table

  1. New Tables
    - `analyzer_runs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `model_version_id` (uuid, references model_versions)
      - `input` (jsonb)
      - `output` (jsonb)
      - `status` (text)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `analyzer_runs` table
    - Add policy for users to view their own runs
    - Add policy for admins to view all runs
*/

CREATE TABLE IF NOT EXISTS analyzer_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  model_version_id uuid NOT NULL REFERENCES model_versions(id),
  input jsonb NOT NULL,
  output jsonb,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analyzer_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for own runs" 
  ON analyzer_runs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Enable read access for admins"
  ON analyzer_runs
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM user_roles 
    WHERE role = 'admin'
  ));