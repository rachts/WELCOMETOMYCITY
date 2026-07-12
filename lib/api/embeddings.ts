import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client to bypass RLS for updating places
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function generateEmbeddingsForPlaces() {
  console.log('Fetching places from Supabase...');
  
  // 1. Fetch all places that don't have an embedding yet (or fetch all if you want to overwrite)
  const { data: places, error } = await supabase
    .from('places')
    .select('id, name, category, short_description, long_description, vibes, best_time')
    .filter('embedding', 'is', null);

  if (error) {
    console.error('Error fetching places:', error);
    return;
  }

  if (!places || places.length === 0) {
    console.log('No places need embeddings.');
    return;
  }

  console.log(`Found ${places.length} places to process.`);

  for (const place of places) {
    console.log(`Generating embedding for: ${place.name}`);
    
    // 2. Construct a rich text string for the embedding
    const contentToEmbed = `
      Name: ${place.name}
      Category: ${place.category}
      Vibes: ${place.vibes.join(', ')}
      Best Time to Visit: ${place.best_time}
      Short Description: ${place.short_description}
      Long Description: ${place.long_description}
    `.trim();

    try {
      // 3. Generate embedding using OpenAI
      const { embedding } = await embed({
        model: openai.embedding('text-embedding-3-small'),
        value: contentToEmbed,
      });

      // 4. Store the embedding back in Supabase
      const { error: updateError } = await supabase
        .from('places')
        .update({ embedding })
        .eq('id', place.id);

      if (updateError) {
        console.error(`Error updating embedding for ${place.name}:`, updateError);
      } else {
        console.log(`Successfully updated embedding for ${place.name}`);
      }
      
      // Optional: Add a small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (e) {
      console.error(`Failed to generate embedding for ${place.name}:`, e);
    }
  }
  
  console.log('Finished generating embeddings.');
}
