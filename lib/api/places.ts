import { createClient } from '@/utils/supabase/server'
import type { Place } from '@/lib/types'

export async function getPlacesByCity(cityId: string): Promise<Place[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('places')
    .select('*')
    .eq('city_id', cityId)

  if (error || !data) {
    console.error('Error fetching places:', error)
    return []
  }

  // Map database format to our application types
  return data.map((p) => ({
    id: p.id,
    name: p.name,
    lat: p.lat,
    lng: p.lng,
    category: p.category,
    image: p.image,
    description: p.description,
    story: p.story,
    hiddenGemScore: p.hidden_gem_score,
    emotionScores: p.emotion_scores,
    bestTime: p.best_time,
    crowdLevel: p.crowd_level,
  }))
}
