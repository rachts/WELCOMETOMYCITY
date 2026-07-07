import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import kolkataData from '@/lib/data/places.json'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Using any for places since the JSON might not perfectly match the NEW Place type yet
    const places: any[] = kolkataData.places

    const insertData = places.map((p) => ({
      id: p.id,
      country: p.country || 'India',
      state: p.state || 'West Bengal',
      city: p.city || 'Kolkata',
      locality: p.locality || null,
      
      name: p.name,
      category: p.category,
      vibes: p.vibes || [],
      
      latitude: p.latitude || p.lat,
      longitude: p.longitude || p.lng,
      
      images: p.images || (p.image ? [p.image] : []),
      short_description: p.shortDescription || p.description || '',
      long_description: p.longDescription || p.story || null,
      
      average_visit_time: p.averageVisitTime || null,
      best_season: p.bestSeason || null,
      best_time: p.bestTime || p.best_time || null,
      entry_fee: p.entryFee || null,
      
      rating: p.rating || null,
      crowd_level: p.crowdLevel || p.crowd_level || null,
      photography_score: p.photographyScore || null,
      accessibility: p.accessibility || null,
      
      tags: p.tags || [],
      nearby_places: p.nearbyPlaces || [],
      
      google_place_id: p.googlePlaceId || null,
      opening_hours: p.openingHours || null,
      travel_tips: p.travelTips || [],
      famous_for: p.famousFor || null,
      
      emotion_scores: p.emotionScores || p.emotion_scores || {},
      hidden_gem_score: p.hiddenGemScore || p.hidden_gem_score || 0.0,
      popularity_score: p.popularityScore || null,
    }))

    const { data, error } = await supabase
      .from('places')
      .upsert(insertData, { onConflict: 'id' })

    if (error) {
      console.error('Supabase Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Successfully seeded places to Supabase!', count: insertData.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
