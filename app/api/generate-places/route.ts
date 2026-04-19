import { generateObject } from "ai"
import { cityPlacesSchema } from "@/lib/places-schema"
import { getCityById } from "@/lib/data/cities"

export async function POST(req: Request) {
  try {
    const { cityId } = await req.json()

    const city = getCityById(cityId)
    if (!city) {
      return Response.json({ error: "City not found" }, { status: 404 })
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
    const placesWithImages = object.places.map((place) => ({
      ...place,
      image: `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(place.imageQuery + " " + city.name)}`,
    }))

    return Response.json({ places: placesWithImages, city: city.name })
  } catch (error) {
    console.error("Error generating places:", error)
    return Response.json({ error: "Failed to generate places" }, { status: 500 })
  }
}
