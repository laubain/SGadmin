/*
  # Create User Streaks Table

  1. New Tables
    - `user_streaks`
      - `user_id` (uuid, primary key)
      - `credits` (integer)
      - `last_activity` (timestamp)
  2. Security
    - Enable RLS on `user_streaks` table
    - Users can only access their own streak data
*/

CREATE TABLE IF NOT EXISTS user_streaks (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  credits integer DEFAULT 0 NOT NULL,
  last_activity timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streak"
  ON user_streaks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streak"
  ON user_streaks
  FOR UPDATE
  USING (auth.uid() = user_id);