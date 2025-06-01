/*
  # Create AI Models Table

  1. New Tables
    - `ai_models`: Stores AI model configurations
      - `id` (uuid, primary key)
      - `llm_provider_id` (uuid, references llm_providers)
      - `name` (text, required)
      - `description` (text, required)
      - `sport_id` (uuid, references sports)
      - `betting_type_id` (uuid, references betting_types)
      - `prompt_template` (text, required)
      - `settings` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on `ai_models`
    - Add policy for admin access only
  3. Relationships
    - References llm_providers, sports, and betting_types tables
*/

CREATE TABLE IF NOT EXISTS ai_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  llm_provider_id uuid NOT NULL REFERENCES llm_providers(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  sport_id uuid NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
  betting_type_id uuid NOT NULL REFERENCES betting_types(id) ON DELETE CASCADE,
  prompt_template text NOT NULL,
  settings jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage AI models" 
  ON ai_models
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  ));
