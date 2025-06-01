/*
  # Create Ads System Tables

  1. New Tables
    - `ads`: Stores ad creatives and metadata
    - `ad_impressions`: Tracks ad views
    - `ad_clicks`: Tracks ad clicks

  2. Security
    - Enable RLS on all tables
    - Public read access for ads
    - Admin-only write access
    - User-specific tracking
*/

CREATE TABLE IF NOT EXISTS ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  text_content text,
  target_url text NOT NULL,
  sport_category text,
  ad_type text NOT NULL CHECK (ad_type IN ('banner', 'promo', 'sponsored')),
  is_active boolean DEFAULT true,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  priority integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS ad_impressions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id uuid REFERENCES ads(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  page_url text NOT NULL,
  sport_category text,
  device_type text,
  viewed_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS ad_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id uuid REFERENCES ads(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  clicked_at timestamptz DEFAULT now() NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS ads_sport_category_idx ON ads(sport_category);
CREATE INDEX IF NOT EXISTS ads_is_active_idx ON ads(is_active);
CREATE INDEX IF NOT EXISTS impressions_ad_id_idx ON ad_impressions(ad_id);
CREATE INDEX IF NOT EXISTS clicks_ad_id_idx ON ad_clicks(ad_id);

-- RLS Policies
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_impressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_clicks ENABLE ROW LEVEL SECURITY;

-- Public can read active ads
CREATE POLICY "Public can view active ads" 
  ON ads 
  FOR SELECT 
  USING (is_active AND (end_date IS NULL OR end_date > now()));

-- Admins have full access
CREATE POLICY "Admins can manage ads" 
  ON ads 
  FOR ALL 
  USING (auth.role() = 'admin');

-- Users can only see their own impressions/clicks
CREATE POLICY "Users can view own impressions" 
  ON ad_impressions 
  FOR SELECT 
  USING (auth.uid() = user_id OR auth.role() = 'admin');

CREATE POLICY "Users can view own clicks" 
  ON ad_clicks 
  FOR SELECT 
  USING (auth.uid() = user_id OR auth.role() = 'admin');

-- Allow tracking of anonymous impressions
CREATE POLICY "Allow anonymous impression tracking"
  ON ad_impressions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow click tracking"
  ON ad_clicks
  FOR INSERT
  WITH CHECK (true);