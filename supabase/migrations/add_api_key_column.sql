/*
  # Add api_key column to llm_providers

  1. Changes
    - Add required api_key column to llm_providers table
    - Column will be NOT NULL after backfilling existing records
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'llm_providers' AND column_name = 'api_key'
  ) THEN
    ALTER TABLE llm_providers ADD COLUMN api_key text;
    UPDATE llm_providers SET api_key = '';
    ALTER TABLE llm_providers ALTER COLUMN api_key SET NOT NULL;
  END IF;
END $$;