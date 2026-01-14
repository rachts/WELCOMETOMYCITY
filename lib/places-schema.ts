import { z } from "zod"

export const placeSchema = z.object({
  id: z.string().describe("URL-friendly unique identifier (kebab-case)"),
  name: z.string().describe("Official name of the place"),
  category: z.enum(["historical", "cultural", "religious", "food-markets", "nature"]).describe("Category of the place"),
  lat: z.number().describe("Latitude coordinate"),
  lng: z.number().describe("Longitude coordinate"),
  description: z.string().describe("2-3 sentence engaging description for tourists"),
  bestTime: z.string().describe("Best time to visit with specific hours if applicable"),
  entryFee: z.string().describe("Entry fee with Indian and foreign tourist prices if different"),
  nearbyStation: z.string().describe("Nearest metro station name if metro exists, otherwise 'N/A'"),
  imageQuery: z.string().describe("Short 3-5 word description for generating a placeholder image"),
})

export const cityPlacesSchema = z.object({
  places: z.array(placeSchema).min(10).max(15).describe("Array of 10-15 famous tourist places in the city"),
})

export type GeneratedPlace = z.infer<typeof placeSchema>
export type CityPlaces = z.infer<typeof cityPlacesSchema>
