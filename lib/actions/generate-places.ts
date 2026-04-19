"use server"

import { generateObject } from "ai"
import { cityPlacesSchema } from "@/lib/places-schema"
import { getCityById } from "@/lib/data/cities"
import type { Place } from "@/lib/types"

export async function generateCityPlaces(cityId: string): Promise<{ places: Place[]; error?: string }> {
  try {
    const city = getCityById(cityId)
    if (!city) {
      return { places: [], error: "City not found" }
    }

    console.log("[v0] Starting place generation for:", city.name)

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

    console.log("[v0] Generated places count:", object.places.length)

    // Transform the places to include proper image URLs
    const placesWithImages: Place[] = object.places.map((place) => ({
      ...place,
      image: `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(place.imageQuery + " " + city.name + " India landmark")}`,
    }))

    return { places: placesWithImages }
  } catch (error) {
    console.error("[v0] Error generating places:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to generate places"
    return { places: [], error: errorMessage }
  }
}
