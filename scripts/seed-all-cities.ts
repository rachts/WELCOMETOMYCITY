import { generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { createClient } from "@supabase/supabase-js"
import { cityPlacesSchema } from "../lib/places-schema"
import { cities } from "../lib/data/cities"
import * as fs from 'fs'
import * as path from 'path'
import { fetchPlaceImage } from '../lib/image-pipeline'

// Manually parse .env.local since dotenv is not installed
const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8')
  envFile.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
    if (match) {
      const key = match[1]
      let value = match[2] || ''
      if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
        value = value.replace(/\\n/gm, '\n')
      }
      value = value.replace(/(^['"]|['"]$)/g, '').trim()
      process.env[key] = value
    }
  })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log("URL:", supabaseUrl)
console.log("Service Key:", serviceRoleKey?.slice(0, 20), "...")

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase credentials (make sure SUPABASE_SERVICE_ROLE_KEY is set in .env.local)")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function seedCity(city: typeof cities[0]) {
  console.log(`\n===========================================`)
  console.log(`Generating places for ${city.name}...`)
  
  try {
    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: cityPlacesSchema,
      prompt: `Generate a list of 12 famous tourist and sightseeing places in ${city.name}, ${city.state}, India.

Include a diverse mix of:
- Historical monuments and heritage sites
- Cultural attractions (museums, theaters, art galleries)
- Religious places (temples, mosques, churches, gurudwaras)
- Food markets and famous food streets
- Nature spots (parks, gardens, lakes, beaches if applicable)

For each place, provide highly detailed metadata. Especially focus on:
- Accurate GPS coordinates (latitude/longitude)
- shortDescription: Engaging 2-3 sentence description
- longDescription: A cinematic, emotional AI-generated narrative story about the place (e.g. "Standing beneath the white Makrana marble, you'll notice how the monument changes personality throughout the day...")
- vibes: Select 1-3 emotional vibes that match (Romantic, Hidden Gem, Peaceful, Foodie, Heritage, Sunset, Photography, Nightlife, Family, Nature)
- Practical visiting information (best time, entry fees, accessibility, average visit time)
- 5-7 descriptive tags and 2-3 travel tips

Focus on places that are:
1. Actually famous and worth visiting
2. Have accurate, real-world coordinates
3. Include both iconic landmarks and local favorites
4. Cover different parts of the city

Ensure the output conforms exactly to the schema.`,
    })

    console.log(`Generated ${object.places.length} places for ${city.name}. Upserting to Supabase...`)

    const insertData = await Promise.all(object.places.map(async (p) => {
      const imageUrl = await fetchPlaceImage(p.name, city.name);
      return {
        id: p.id,
        country: p.country,
        state: p.state,
        city: city.id,
        locality: p.locality || null,
        
        name: p.name,
        category: p.category,
        vibes: p.vibes || [],
        
        latitude: p.latitude,
        longitude: p.longitude,
        
        images: imageUrl ? [imageUrl] : [],
        short_description: p.shortDescription,
        long_description: p.longDescription,
        
        average_visit_time: p.averageVisitTime || null,
        best_season: p.bestSeason || null,
        best_time: p.bestTime || null,
        entry_fee: p.entryFee || null,
        
        rating: p.rating || null,
        crowd_level: p.crowdLevel || null,
        photography_score: p.photographyScore || null,
        accessibility: p.accessibility || null,
        
        tags: p.tags || [],
        nearby_places: p.nearbyPlaces || [],
        
        google_place_id: p.googlePlaceId || null,
        opening_hours: p.openingHours || null,
        travel_tips: p.travelTips || [],
        famous_for: p.famousFor || null,
        
        emotion_scores: p.emotionScores || {},
        hidden_gem_score: p.hiddenGemScore || 0.0,
        popularity_score: p.popularityScore || null,
      };
    }))

    const { error } = await supabase
      .from('places')
      .upsert(insertData, { onConflict: 'id' })

    if (error) {
      console.error(`Supabase Upsert Error for ${city.name}:`, error.message)
    } else {
      console.log(`✅ Successfully seeded ${city.name}!`)
    }
  } catch (error: any) {
    console.error(`❌ Failed to process ${city.name}:`, error.message)
  }
}

async function main() {
  console.log("Starting master seed script for all cities...")
  
  for (const city of cities) {
    // Skip Kolkata if it's already fully seeded, or just re-seed to get rich AI text
    // Actually, we'll just seed everything to ensure high quality data.
    await seedCity(city)
    // Wait 15 seconds to avoid rate limits (Gemini free tier has 15 RPM limit)
    await sleep(15000)
  }
  
  console.log("\n🎉 Seeding complete!")
}

main()
