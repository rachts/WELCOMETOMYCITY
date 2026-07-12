-- Create a function to search for places using vector similarity
CREATE OR REPLACE FUNCTION match_places (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id text,
  name text,
  category text,
  short_description text,
  long_description text,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    places.id,
    places.name,
    places.category,
    places.short_description,
    places.long_description,
    1 - (places.embedding <=> query_embedding) AS similarity
  FROM public.places
  WHERE 1 - (places.embedding <=> query_embedding) > match_threshold
  ORDER BY places.embedding <=> query_embedding
  LIMIT match_count;
$$;
