/*
  # Create Subscriptions Table

  1. New Tables
    - `subscriptions`: Tracks user subscriptions with Stripe
  2. Security
    - Enable RLS
    - Users can only access their own subscription data
*/

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  stripe_subscription_id text UNIQUE,
  stripe_customer_id text UNIQUE,
  status text NOT NULL,
  amount integer,
  current_period_end timestamptz,
  trial_end timestamptz,
  canceled_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription" 
  ON subscriptions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage subscriptions" 
  ON subscriptions 
  FOR ALL 
  TO authenticated 
  USING (auth.role() = 'admin');

CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON subscriptions(status);