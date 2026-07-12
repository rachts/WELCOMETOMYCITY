-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector
with
  schema extensions;

-- Add the embedding column to the places table
ALTER TABLE public.places 
ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Optional: Create an index for faster similarity searches (HNSW is recommended for pgvector >= 0.5.0)
CREATE INDEX IF NOT EXISTS places_embedding_idx 
ON public.places 
USING hnsw (embedding vector_cosine_ops);
