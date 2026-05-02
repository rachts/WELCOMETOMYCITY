'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import type { ItineraryDay } from '@/lib/types'

export async function saveItinerary(city: string, emotion: string, days: number, places: ItineraryDay[]) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'You must be logged in to save itineraries.' }
  }

  const { error } = await supabase
    .from('itineraries')
    .insert({ 
      user_id: user.id, 
      city, 
      emotion, 
      days,
      places: JSON.stringify(places) 
    })

  if (error) {
    console.error(error)
    return { error: 'Failed to save itinerary.' }
  }

  revalidatePath('/my-trips')
  return { success: true }
}
