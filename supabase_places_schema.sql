-- Create places table
CREATE TABLE public.places (
  id TEXT PRIMARY KEY,
  city_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  image TEXT,
  description TEXT,
  story TEXT,
  emotion_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  hidden_gem_score DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  best_time TEXT,
  crowd_level TEXT,
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
