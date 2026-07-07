'use server'

import { createClient } from '@/utils/supabase/server'
import type { Place } from '@/lib/types'

export async function getPlacesByCity(city: string): Promise<Place[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('places')
    .select('*')
    .eq('city', city)

  if (error || !data) {
    console.error('Error fetching places from Supabase:', error ? JSON.stringify(error, null, 2) : 'No data returned')
    return []
  }

  // Map database format to our application types
  return data.map((p) => ({
    id: p.id,
    country: p.country,
    state: p.state,
    city: p.city,
    locality: p.locality,
    
    name: p.name,
    category: p.category,
    vibes: p.vibes || [],
    
    latitude: p.latitude,
    longitude: p.longitude,
    
    images: p.images || [],
    shortDescription: p.short_description,
    longDescription: p.long_description,
    
    averageVisitTime: p.average_visit_time,
    bestSeason: p.best_season,
    bestTime: p.best_time,
    entryFee: p.entry_fee,
    
    rating: p.rating,
    crowdLevel: p.crowd_level,
    photographyScore: p.photography_score,
    accessibility: p.accessibility,
    
    tags: p.tags || [],
    nearbyPlaces: p.nearby_places || [],
    
    googlePlaceId: p.google_place_id,
    openingHours: p.opening_hours,
    travelTips: p.travel_tips || [],
    famousFor: p.famous_for,
    
    emotionScores: p.emotion_scores || {},
    hiddenGemScore: p.hidden_gem_score || 0,
    popularityScore: p.popularity_score,
  }))
}
