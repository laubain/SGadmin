/*
  # Add XP and Badges System

  1. New Tables
    - `user_xp`: Tracks XP points and level
    - `user_badges`: Tracks earned badges
  2. Security
    - Enable RLS on all new tables
    - Users can only access their own data
*/

CREATE TABLE IF NOT EXISTS user_xp (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  xp_points integer DEFAULT 0 NOT NULL,
  level integer DEFAULT 1 NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  badge_id text NOT NULL,
  earned_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS badge_definitions (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  image_url text,
  xp_reward integer DEFAULT 0 NOT NULL
);

-- Predefined badges
INSERT INTO badge_definitions (id, name, description, xp_reward)
VALUES 
  ('streak-3', '3-Day Streak', 'Maintained a 3-day streak', 50),
  ('streak-7', '7-Day Streak', 'Maintained a 7-day streak', 100),
  ('streak-30', '30-Day Streak', 'Maintained a 30-day streak', 500),
  ('first-scan', 'First Scan', 'Completed your first bet slip scan', 25),
  ('power-user', 'Power User', 'Used the app for 10+ days', 200);

ALTER TABLE user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own XP" 
  ON user_xp 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own badges" 
  ON user_badges 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage badges" 
  ON badge_definitions 
  FOR ALL 
  TO authenticated 
  USING (auth.role() = 'admin');