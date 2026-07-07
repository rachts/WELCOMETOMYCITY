-- Drop existing table if it exists (warning: this will delete existing data)
DROP TABLE IF EXISTS public.places CASCADE;

-- Create places table
CREATE TABLE public.places (
  id TEXT PRIMARY KEY,
  country TEXT NOT NULL DEFAULT 'India',
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  locality TEXT,
  
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  vibes TEXT[] NOT NULL DEFAULT '{}',
  
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  
  images TEXT[] NOT NULL DEFAULT '{}',
  short_description TEXT NOT NULL,
  long_description TEXT,
  
  average_visit_time TEXT,
  best_season TEXT,
  best_time TEXT,
  entry_fee TEXT,
  
  rating DOUBLE PRECISION,
  crowd_level TEXT,
  photography_score DOUBLE PRECISION,
  accessibility TEXT,
  
  tags TEXT[] DEFAULT '{}',
  nearby_places TEXT[] DEFAULT '{}',
  
  google_place_id TEXT,
  opening_hours TEXT,
  travel_tips TEXT[] DEFAULT '{}',
  famous_for TEXT,
  
  emotion_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  hidden_gem_score DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  popularity_score DOUBLE PRECISION,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for places
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;

-- Create Policies for places
-- Places are public read-only data
CREATE POLICY "Places are viewable by everyone." 
ON public.places FOR SELECT 
USING (true);

-- Only service role (admin) can insert/update/delete places (done via Seed Script)
