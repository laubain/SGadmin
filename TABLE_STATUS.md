# Table Status Report

## ✅ Existing Tables (with migrations)

1. `users` (via Supabase Auth)
   - Managed by Supabase Auth (auth.users)
   - Has associated `profiles` table with additional fields

2. `subscriptions`
   - Defined in `create_subscriptions_table.sql`
   - Contains Stripe integration fields
   - Has proper RLS policies

3. `ai_models` (similar to `models`)
   - Defined in `create_ai_models.sql`
   - Contains model configurations
   - Missing `model_versions` table

4. `user_streaks` (similar to `streaks`)
   - Defined in `create_user_streaks_table.sql`
   - Tracks user activity credits

5. `ads`
   - Defined in `create_ads_table.sql`
   - Complete ad system with impressions/clicks

## ❌ Missing Tables

1. `model_versions`
   - Not found in migrations
   - Would complement `ai_models`

2. `analyzer_runs`
   - Not found in migrations
   - Would track model executions

3. `uploads`
   - Not found in migrations
   - Would manage file uploads

4. `api_logs`
   - Not found in migrations
   - Would track API usage

## Recommended Actions

1. Create migration for `model_versions`:
```sql
CREATE TABLE model_versions (
  id UUID PRIMARY KEY,
  model_id UUID REFERENCES ai_models,
  version TEXT NOT NULL,
  config JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

2. Create migration for `analyzer_runs`:
```sql
CREATE TABLE analyzer_runs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  model_version_id UUID REFERENCES model_versions,
  input JSONB NOT NULL,
  output JSONB,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

3. Create migration for `api_logs`:
```sql
CREATE TABLE api_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  endpoint TEXT NOT NULL,
  status_code INTEGER,
  response_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

Would you like me to create complete migration files for any of these missing tables?
