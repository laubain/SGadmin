/*
  # Add Visibility Column to AI Models

  1. Changes
    - Adds `visibility` column to `ai_models` table
    - Sets default value to 'public'
    - Updates existing records to have 'public' visibility
    - Updates policy with correct syntax
*/

DO $$
BEGIN
  -- Add column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ai_models' AND column_name = 'visibility'
  ) THEN
    ALTER TABLE ai_models ADD COLUMN visibility TEXT NOT NULL DEFAULT 'public';
    UPDATE ai_models SET visibility = 'public' WHERE visibility IS NULL;
  END IF;

  -- Drop existing policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' 
    AND tablename = 'ai_models'
    AND policyname = 'Enable read access for all users'
  ) THEN
    DROP POLICY "Enable read access for all users" ON ai_models;
  END IF;

  -- Create new policy
  CREATE POLICY "Enable read access for all users" 
    ON ai_models FOR SELECT 
    USING (visibility = 'public');
END $$;