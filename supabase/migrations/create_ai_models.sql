/*
  # AI Models System Setup

  1. Tables
    - `ai_models`: Stores AI model configurations
    - `api_keys`: Stores API keys for different providers
  2. Security
    - Enable RLS on all tables
    - Create policies for admin access
  3. Model Configuration
    - Support multiple sports and model types
    - Track visibility (public/private)
*/

-- Create ai_models table
CREATE TABLE IF NOT EXISTS ai_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  sport TEXT NOT NULL,
  model_type TEXT NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'public',
  input_schema JSONB NOT NULL,
  prompt_template TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  api_key TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Model policies
CREATE POLICY "Enable read access for all users" 
  ON ai_models FOR SELECT 
  USING (visibility = 'public');

CREATE POLICY "Enable all access for admins" 
  ON ai_models FOR ALL 
  USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  ));

-- API Key policies
CREATE POLICY "Enable all access for admins to api_keys" 
  ON api_keys FOR ALL 
  USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  ));