/*
  # Create llm_providers table

  1. New Tables
    - `llm_providers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `model_name` (text)  <!-- Changed from model_label to model_name -->
      - `api_key` (text)
      - `api_url` (text)
      - `default_params` (jsonb)
      - `status` (boolean)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `llm_providers`
    - Add policy for admin access only
*/

CREATE TABLE IF NOT EXISTS llm_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  model_name text NOT NULL,  <!-- Changed from model_label to model_name -->
  api_key text NOT NULL,
  api_url text,
  default_params jsonb,
  status boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE llm_providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage LLM providers" 
  ON llm_providers
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  ));
