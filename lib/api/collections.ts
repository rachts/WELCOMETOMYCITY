'use server'

import { createClient } from '@/utils/supabase/server'
import type { Collection } from '@/lib/types'

export async function getCollectionsByCity(city: string): Promise<Collection[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('city', city)

  if (error || !data) {
    console.error('Error fetching collections from Supabase:', error ? JSON.stringify(error, null, 2) : 'No data returned')
    return []
  }

  // Map database format to our application types
  return data.map((c) => ({
    id: c.id,
    city: c.city,
    title: c.title,
    description: c.description,
    coverImage: c.cover_image,
    places: c.places || [],
  }))
}
