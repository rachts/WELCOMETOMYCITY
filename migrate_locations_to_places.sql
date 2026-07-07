-- Migration script to copy data from the old 'locations' table to the new 'places' table

INSERT INTO public.places (
    id, 
    name, 
    city, 
    state, 
    country, 
    category, 
    latitude, 
    longitude, 
    images, 
    short_description,
    hidden_gem_score
)
SELECT 
    id, 
    name, 
    city_id as city, 
    'Maharashtra' as state, -- You may need to adjust this depending on the city, but it serves as a fallback
    'India' as country, 
    category, 
    lat as latitude, 
    lng as longitude, 
    ARRAY[image] as images, -- Wrap single image string into an array
    name as short_description, -- Fallback description
    0.0 as hidden_gem_score
FROM public.locations
ON CONFLICT (id) DO NOTHING;
