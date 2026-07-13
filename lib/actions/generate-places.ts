"use server"

import { generateObject } from "ai"
import { cityPlacesSchema } from "@/lib/places-schema"
import { getCityById } from "@/lib/data/cities"
import type { Place } from "@/lib/types"
import { z } from "zod"
import { fetchPlaceImage } from "@/lib/image-pipeline"

const cityIdSchema = z.string().min(1, "Invalid city ID")

export async function generateCityPlaces(rawCityId: string): Promise<{ places: Place[]; error?: string }> {
  try {
    const parseResult = cityIdSchema.safeParse(rawCityId)
    if (!parseResult.success) {
      return { places: [], error: "Invalid city ID format" }
    }
    const cityId = parseResult.data

    const city = getCityById(cityId)
    if (!city) {
      return { places: [], error: "City not found" }
    }

    const { object } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: cityPlacesSchema,
      prompt: `Generate a list of 12-15 famous tourist and sightseeing places in ${city.name}, ${city.state}, India.

Include a diverse mix of:
- Historical monuments and heritage sites
- Cultural attractions (museums, theaters, art galleries)
- Religious places (temples, mosques, churches, gurudwaras)
- Food markets and famous food streets
- Nature spots (parks, gardens, lakes, beaches if applicable)

For each place, provide:
- Accurate GPS coordinates (lat/lng)
- Engaging 2-3 sentence description highlighting what makes it special
- Practical visiting information (best time, entry fees)
- Nearest metro station name (if ${city.name} has metro, otherwise use 'N/A')
- A short image query (3-5 words) that captures the essence of the place for image generation

Focus on places that are:
1. Actually famous and worth visiting
2. Have accurate, real-world coordinates
3. Include both iconic landmarks and local favorites
4. Cover different parts of the city

Make the descriptions engaging and informative for tourists.`,
    })

    // Transform the places to include proper image URLs
    const placesWithImages: Place[] = await Promise.all(
      object.places.map(async (place) => {
        // Remove imageQuery from the final Place object
        const { imageQuery, ...rest } = place;
        
        // Fetch actual image URL (Google -> Wikipedia -> Unsplash)
        const imageUrl = await fetchPlaceImage(place.name, city.name);

        return {
          ...rest,
          images: imageUrl ? [imageUrl] : [],
        };
      })
    )

    return { places: placesWithImages }
  } catch (error) {
    console.error("[v0] Error generating places:", error)
    return { places: [], error: "Internal Server Error" }
  }
}
