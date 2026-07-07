-- Create collections table
CREATE TABLE public.collections (
  id TEXT PRIMARY KEY,
  city TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  places TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for collections
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

-- Create Policies for collections
-- Collections are public read-only data
CREATE POLICY "Collections are viewable by everyone." 
ON public.collections FOR SELECT 
USING (true);

-- Only service role (admin) can insert/update/delete collections
