/*
  # Create api_keys table

  1. New Tables
    - `api_keys`
      - `id` (uuid, primary key)
      - `provider` (text)
      - `api_key` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `api_keys` table
    - Add policy for admin access only
*/

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  api_key TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for admins to api_keys" 
  ON api_keys FOR ALL 
  USING (auth.role() = 'admin');