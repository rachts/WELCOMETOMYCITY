import { z } from "zod"

export const vibeSchema = z.enum([
  "Romantic", "Hidden Gem", "Peaceful", "Foodie", 
  "Heritage", "Sunset", "Photography", "Nightlife", 
  "Family", "Nature"
])

export const placeSchema = z.object({
  id: z.string().describe("URL-friendly unique identifier (kebab-case)"),
  country: z.string().default("India"),
  state: z.string(),
  city: z.string(),
  locality: z.string().describe("The specific neighborhood or area"),
  
  name: z.string().describe("Official name of the place"),
  category: z.string().describe("Category of the place (e.g. Monument, Park, Market, Temple)"),
  vibes: z.array(vibeSchema).describe("Select 1-3 vibes that best match this place"),
  
  latitude: z.number().describe("Latitude coordinate"),
  longitude: z.number().describe("Longitude coordinate"),
  
  shortDescription: z.string().describe("2-3 sentence engaging description for tourists"),
  longDescription: z.string().describe("An AI-generated narrative story about the place. Make it cinematic and emotional, describing how the place feels, its history, or its atmosphere. (e.g. 'Standing beneath the white Makrana marble...')"),
  
  averageVisitTime: z.string().describe("e.g., '1-2 hours', 'Half day'"),
  bestSeason: z.string().describe("e.g., 'Winter (Oct-Mar)'"),
  bestTime: z.string().describe("Best time of day to visit with specific hours if applicable"),
  entryFee: z.string().describe("Entry fee details (e.g., '₹30 for Indians, ₹500 for foreigners')"),
  
  rating: z.number().min(0).max(5).describe("Estimated rating out of 5"),
  crowdLevel: z.string().describe("Typical crowd level (e.g. 'Very Crowded', 'Peaceful', 'Moderate')"),
  photographyScore: z.number().min(0).max(10).describe("Score out of 10 for photography potential"),
  accessibility: z.string().describe("Details about wheelchair/stroller access"),
  
  tags: z.array(z.string()).describe("5-7 tags like 'architecture', 'street food', 'lake', 'history'"),
  nearbyPlaces: z.array(z.string()).describe("IDs of 2-3 nearby places that can be walked to"),
  
  googlePlaceId: z.string().optional().describe("Leave empty or provide if known"),
  openingHours: z.string().describe("e.g., '10:00 AM - 6:00 PM, Closed on Mondays'"),
  travelTips: z.array(z.string()).describe("2-3 practical tips for visiting (e.g., 'Carry water', 'Beware of monkeys')"),
  famousFor: z.string().describe("One sentence on what makes it famous"),
  
  hiddenGemScore: z.number().min(0).max(10).describe("A score from 0 to 10 indicating how 'hidden' or offbeat this place is (10 means very hidden)"),
  popularityScore: z.number().min(0).max(10).describe("Score out of 10 for how popular/touristy it is"),
  
  emotionScores: z.object({
    romantic: z.number().min(0).max(1),
    peaceful: z.number().min(0).max(1),
    adventurous: z.number().min(0).max(1),
    cultural: z.number().min(0).max(1),
    social: z.number().min(0).max(1),
  }).describe("Scores between 0 and 1 indicating how much the place evokes these emotions"),
  
  imageQuery: z.string().describe("Short 3-5 word description for generating a placeholder image"),
})

export const cityPlacesSchema = z.object({
  places: z.array(placeSchema).min(10).max(15).describe("Array of 10-15 famous tourist places in the city"),
})

export type GeneratedPlace = z.infer<typeof placeSchema>
export type CityPlaces = z.infer<typeof cityPlacesSchema>
