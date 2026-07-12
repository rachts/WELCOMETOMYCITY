'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function savePlace(placeId: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'You must be logged in to save places.' }
  }

  const { error } = await supabase
    .from('saved_places')
    .insert({ user_id: user.id, place_id: placeId })

  if (error) {
    // If it's a unique constraint violation, it means it's already saved
    if (error.code === '23505') {
      return { success: true, message: 'Place already saved!' }
    }
    return { error: 'Failed to save place.' }
  }

  revalidatePath('/my-trips')
  revalidatePath('/explore')
  
  return { success: true }
}

export async function voteVibe(placeId: string, vibeTag: string, voteType: 'upvote' | 'downvote') {
  const supabase = await createClient()
  
  // First, check if the record exists
  const { data: existing } = await supabase
    .from('place_vibes_votes')
    .select('*')
    .eq('place_id', placeId)
    .eq('vibe_tag', vibeTag)
    .single()

  if (existing) {
    // Update existing
    const updatePayload = voteType === 'upvote' 
      ? { upvotes: existing.upvotes + 1 }
      : { downvotes: existing.downvotes + 1 }
      
    await supabase
      .from('place_vibes_votes')
      .update(updatePayload)
      .eq('id', existing.id)
  } else {
    // Insert new
    const insertPayload = voteType === 'upvote'
      ? { place_id: placeId, vibe_tag: vibeTag, upvotes: 1, downvotes: 0 }
      : { place_id: placeId, vibe_tag: vibeTag, upvotes: 0, downvotes: 1 }
      
    await supabase
      .from('place_vibes_votes')
      .insert(insertPayload)
  }
  
  return { success: true }
}
