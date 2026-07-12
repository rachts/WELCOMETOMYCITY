-- Track 3: Community Vibe Upvoting System

CREATE TABLE IF NOT EXISTS public.place_vibes_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id TEXT NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
    vibe_tag TEXT NOT NULL,
    upvotes INTEGER NOT NULL DEFAULT 0,
    downvotes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(place_id, vibe_tag)
);

-- Enable RLS
ALTER TABLE public.place_vibes_votes ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow public read access on place_vibes_votes"
    ON public.place_vibes_votes
    FOR SELECT
    USING (true);

-- Allow anonymous inserts (for the sake of the demo, users can vote without auth)
CREATE POLICY "Allow public insert on place_vibes_votes"
    ON public.place_vibes_votes
    FOR INSERT
    WITH CHECK (true);

-- Allow anonymous updates (incrementing votes)
CREATE POLICY "Allow public update on place_vibes_votes"
    ON public.place_vibes_votes
    FOR UPDATE
    USING (true)
    WITH CHECK (true);
