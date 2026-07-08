import { generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { cityPlacesSchema } from "@/lib/places-schema"
import { getCityById } from "@/lib/data/cities"
import { z } from "zod"

const requestSchema = z.object({
  cityId: z.string().min(1, "cityId is required")
})

export async function POST(req: Request) {
  try {
    let body
    try {
      body = await req.json()
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 })
    }

    const parseResult = requestSchema.safeParse(body)
    if (!parseResult.success) {
      return Response.json({ error: "Invalid request payload" }, { status: 400 })
    }
    const { cityId } = parseResult.data

    const city = getCityById(cityId)
    if (!city) {
      return Response.json({ error: "City not found" }, { status: 404 })
    }

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: cityPlacesSchema,
      prompt: `Generate a list of 12-15 famous tourist and sightseeing places in ${city.name}, ${city.state}, India.

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

    // Transform the places to include proper image URLs as an array
    const placesWithImages = object.places.map((place) => ({
      ...place,
      images: [`/placeholder.svg?height=300&width=400&query=${encodeURIComponent(place.imageQuery + " " + city.name)}`],
    }))

    return Response.json({ places: placesWithImages, city: city.name })
  } catch (error) {
    console.error("Error generating places:", error)
    return Response.json({ error: "Failed to generate places" }, { status: 500 })
  }
}
