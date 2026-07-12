import { createClient } from '@/utils/supabase/client'

export async function getVibeVotes(placeId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('place_vibes_votes')
    .select('vibe_tag, upvotes, downvotes')
    .eq('place_id', placeId)
    
  if (error) {
    console.error("Error fetching vibe votes:", error)
    return []
  }
  
  return data || []
}
