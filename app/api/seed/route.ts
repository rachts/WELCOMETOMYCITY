import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import kolkataData from '@/lib/data/places.json'
import type { Place } from '@/lib/types'

export async function GET() {
  try {
    // We must use the Service Role key to bypass RLS for seeding,
    // OR we can just allow the ANON key to insert if RLS allows it.
    // For this seed script, if RLS blocks ANON insert, we need the service role key.
    // However, since this is an admin script, we'll try with ANON first, 
    // but the user should ideally temporarily disable RLS for insertion or use service_role.
    
    // Using the standard client for now. 
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Note: RLS must allow insert or use service_role key
    )

    const places: Place[] = kolkataData.places as Place[]

    const insertData = places.map((p) => ({
      id: p.id,
      city_id: 'kolkata',
      name: p.name,
      category: p.category,
      lat: p.lat,
      lng: p.lng,
      image: p.image,
      description: p.description,
      story: p.story,
      emotion_scores: p.emotionScores,
      hidden_gem_score: p.hiddenGemScore,
      best_time: p.bestTime,
      crowd_level: p.crowdLevel,
    }))

    const { data, error } = await supabase
      .from('places')
      .upsert(insertData, { onConflict: 'id' })

    if (error) {
      console.error('Supabase Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Successfully seeded 25 places to Supabase!', count: insertData.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
