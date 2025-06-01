/*
  # Create model_versions table

  1. New Tables
    - `model_versions`
      - `id` (uuid, primary key)
      - `model_id` (uuid, references ai_models)
      - `version` (text)
      - `config` (jsonb)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `model_versions` table
    - Add policy for authenticated users to read public model versions
    - Add policy for admins to manage all versions
*/

CREATE TABLE IF NOT EXISTS model_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL REFERENCES ai_models(id),
  version text NOT NULL,
  config jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE model_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for public models" 
  ON model_versions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ai_models 
      WHERE ai_models.id = model_versions.model_id 
      AND ai_models.visibility = 'public'
    )
  );

CREATE POLICY "Enable all access for admins"
  ON model_versions
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM user_roles 
    WHERE role = 'admin'
  ));