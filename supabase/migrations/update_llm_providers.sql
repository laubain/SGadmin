/*
  # Update llm_providers table

  1. Changes
    - Add status column if missing
    - Ensure all columns match our form requirements
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'llm_providers' AND column_name = 'status'
  ) THEN
    ALTER TABLE llm_providers ADD COLUMN status boolean DEFAULT true;
  END IF;
END $$;

ALTER TABLE llm_providers ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE POLICY "Admin can manage LLM providers" 
  ON llm_providers
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  ));
