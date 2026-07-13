import { createClient } from '@supabase/supabase-js'
import { loadEnvConfig } from '@next/env'
import { fetchPlaceImage } from '../lib/image-pipeline'

// Load environment variables from .env.local
const projectDir = process.cwd()
loadEnvConfig(projectDir)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase URL or Key in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function main() {
  console.log('Starting image backfill process...')
  
  // 1. Fetch places that have placeholder images or no images
  const { data: places, error } = await supabase
    .from('places')
    .select('id, name, city_id, images')
  
  if (error) {
    console.error('Error fetching places:', error)
    return
  }

  if (!places || places.length === 0) {
    console.log('No places found.')
    return
  }

  // Filter to only places that have placeholder or no images
  const placesToUpdate = places.filter(p => !p.images || p.images.length === 0 || p.images.some((img: string) => img.includes('placeholder.svg')))

  console.log(`Found ${placesToUpdate.length} places needing updates. Checking for real photos...`)

  let updatedCount = 0;

  for (const place of placesToUpdate) {
    // Fetch the city name
    const { data: cityData } = await supabase
      .from('cities')
      .select('name')
      .eq('id', place.city_id)
      .single()

    const cityName = cityData?.name || ''
    
    console.log(`Fetching real photo for: ${place.name} in ${cityName}...`)
    const imageUrl = await fetchPlaceImage(place.name, cityName)

    if (imageUrl) {
      const { error: updateError } = await supabase
        .from('places')
        .update({ images: [imageUrl] })
        .eq('id', place.id)

      if (updateError) {
        console.error(`Failed to update ${place.name}:`, updateError)
      } else {
        console.log(`Successfully updated ${place.name}`)
        updatedCount++
      }
    } else {
      console.log(`No image found for ${place.name}, using fallback.`)
      // Set to empty array to trigger frontend fallback logic
      await supabase
        .from('places')
        .update({ images: [] })
        .eq('id', place.id)
    }
    
    // Add a small delay to avoid hitting rate limits
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  console.log(`Finished! Updated ${updatedCount} places.`)
}

main().catch(console.error)
