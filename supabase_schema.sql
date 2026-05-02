-- Create tables
CREATE TABLE public.saved_places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  place_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, place_id)
);

CREATE TABLE public.itineraries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  city TEXT NOT NULL,
  emotion TEXT NOT NULL,
  days INTEGER NOT NULL,
  places JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.saved_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;

-- Create Policies for saved_places
CREATE POLICY "Users can view their own saved places" 
ON public.saved_places FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved places" 
ON public.saved_places FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved places" 
ON public.saved_places FOR DELETE 
USING (auth.uid() = user_id);

-- Create Policies for itineraries
CREATE POLICY "Users can view their own itineraries" 
ON public.itineraries FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own itineraries" 
ON public.itineraries FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own itineraries" 
ON public.itineraries FOR DELETE 
USING (auth.uid() = user_id);
