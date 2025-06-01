/*
  # Update Admin Policies to use auth.role()

  1. Changes
    - Updates all admin policies to use auth.role() instead of user_roles lookup
    - More efficient and reliable permission checking
  2. Affected Tables
    - ai_models
    - api_keys
    - model_versions
    - analyzer_runs
    - api_logs
    - uploads
*/

-- Update ai_models policies
DROP POLICY IF EXISTS "Enable all access for admins" ON ai_models;
CREATE POLICY "Enable all access for admins" 
  ON ai_models FOR ALL 
  USING (auth.role() = 'admin');

-- Update api_keys policies
DROP POLICY IF EXISTS "Enable all access for admins to api_keys" ON api_keys;
CREATE POLICY "Enable all access for admins to api_keys" 
  ON api_keys FOR ALL 
  USING (auth.role() = 'admin');

-- Update model_versions policies
DROP POLICY IF EXISTS "Enable all access for admins" ON model_versions;
CREATE POLICY "Enable all access for admins"
  ON model_versions
  FOR ALL
  USING (auth.role() = 'admin');

-- Update analyzer_runs policies
DROP POLICY IF EXISTS "Enable read access for admins" ON analyzer_runs;
CREATE POLICY "Enable read access for admins"
  ON analyzer_runs
  FOR SELECT
  USING (auth.role() = 'admin');

-- Update api_logs policies
DROP POLICY IF EXISTS "Enable read access for admins" ON api_logs;
CREATE POLICY "Enable read access for admins"
  ON api_logs
  FOR SELECT
  USING (auth.role() = 'admin');

-- Update uploads policies
DROP POLICY IF EXISTS "Enable all access for admins" ON uploads;
CREATE POLICY "Enable all access for admins"
  ON uploads
  FOR ALL
  USING (auth.role() = 'admin');