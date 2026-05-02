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
