/*
  # Website Health Analyzer Database Schema

  1. New Tables
    - `profiles` - Extended user profile data
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `websites` - User submitted websites
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `url` (text, unique per user)
      - `title` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `analyses` - Website analysis results
      - `id` (uuid, primary key)
      - `website_id` (uuid, foreign key to websites)
      - `performance_score` (integer, 0-100)
      - `seo_score` (integer, 0-100)
      - `accessibility_score` (integer, 0-100)
      - `security_score` (integer, 0-100)
      - `overall_score` (integer, 0-100)
      - `performance_details` (jsonb)
      - `seo_details` (jsonb)
      - `accessibility_details` (jsonb)
      - `security_details` (jsonb)
      - `created_at` (timestamp)
    
    - `notifications` - User notifications
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `website_id` (uuid, foreign key to websites)
      - `message` (text)
      - `type` (text) - 'info', 'warning', 'success', 'error'
      - `read` (boolean, default false)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for reading public website data (if needed)
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create websites table
CREATE TABLE IF NOT EXISTS websites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  title text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, url)
);

-- Create analyses table
CREATE TABLE IF NOT EXISTS analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id uuid REFERENCES websites(id) ON DELETE CASCADE NOT NULL,
  performance_score integer NOT NULL CHECK (performance_score >= 0 AND performance_score <= 100),
  seo_score integer NOT NULL CHECK (seo_score >= 0 AND seo_score <= 100),
  accessibility_score integer NOT NULL CHECK (accessibility_score >= 0 AND accessibility_score <= 100),
  security_score integer NOT NULL CHECK (security_score >= 0 AND security_score <= 100),
  overall_score integer NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  performance_details jsonb DEFAULT '{}',
  seo_details jsonb DEFAULT '{}',
  accessibility_details jsonb DEFAULT '{}',
  security_details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  website_id uuid REFERENCES websites(id) ON DELETE CASCADE,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for websites
CREATE POLICY "Users can manage own websites"
  ON websites FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for analyses
CREATE POLICY "Users can view analyses of own websites"
  ON analyses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM websites 
      WHERE websites.id = analyses.website_id 
      AND websites.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert analyses"
  ON analyses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM websites 
      WHERE websites.id = analyses.website_id 
      AND websites.user_id = auth.uid()
    )
  );

-- Create policies for notifications
CREATE POLICY "Users can manage own notifications"
  ON notifications FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS websites_user_id_idx ON websites(user_id);
CREATE INDEX IF NOT EXISTS websites_created_at_idx ON websites(created_at DESC);
CREATE INDEX IF NOT EXISTS analyses_website_id_idx ON analyses(website_id);
CREATE INDEX IF NOT EXISTS analyses_created_at_idx ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_read_idx ON notifications(read);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_websites_updated_at 
  BEFORE UPDATE ON websites 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();