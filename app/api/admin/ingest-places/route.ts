import { NextResponse } from 'next/server'
import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { createClient } from '@supabase/supabase-js'
import { cityPlacesSchema } from '@/lib/places-schema'

export async function POST(req: Request) {
  try {
    const { city_id, topic = "famous tourist and sightseeing places" } = await req.json()

    if (!city_id) {
      return NextResponse.json({ error: "Missing city_id" }, { status: 400 })
    }

    // We'll generate 15 places based on the topic
    const { object } = await generateObject({
      model: google("gemini-3-flash-preview"),
      schema: cityPlacesSchema,
      prompt: `Generate a list of 12-15 ${topic} in the city of ${city_id}, India.
      
      For each place, provide highly accurate GPS coordinates, an engaging description, a fascinating story, a hidden gem score (0-10), and emotion scores (0-1).
      Make sure to include a mix of popular landmarks and offbeat hidden gems.`,
    })

    // Prepare Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Map AI output to database schema
    const insertData = object.places.map((place) => ({
      id: place.id,
      city_id: city_id,
      name: place.name,
      category: place.category,
      lat: place.lat,
      lng: place.lng,
      image: `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(place.imageQuery + " " + city_id)}`,
      description: place.description,
      story: place.story,
      emotion_scores: place.emotion_scores,
      hidden_gem_score: place.hidden_gem_score,
      best_time: place.bestTime,
      crowd_level: place.crowd_level,
    }))

    const { data, error } = await supabase
      .from('locations')
      .upsert(insertData, { onConflict: 'id' })

    if (error) {
      console.error('Supabase Error during ingestion:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      message: `Successfully generated and ingested ${insertData.length} places into locations table!`,
      places: insertData 
    })

  } catch (error: any) {
    console.error("Error in ingestion pipeline:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
