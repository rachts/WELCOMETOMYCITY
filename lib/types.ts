export interface Station {
  id: string
  name: string
  lat: number
  lng: number
  lines: string[]
}

export type Emotion = 
  | "romantic" 
  | "peaceful" 
  | "adventurous" 
  | "cultural" 
  | "luxury" 
  | "chaotic" 
  | "spiritual" 
  | "social"

export type ExperienceMode = "romantic" | "hidden-gems" | "cultural-deep-dive" | "food-crawl"

export type Vibe = 
  | "Romantic"
  | "Hidden Gem"
  | "Peaceful"
  | "Foodie"
  | "Heritage"
  | "Sunset"
  | "Photography"
  | "Nightlife"
  | "Family"
  | "Nature"

export interface Place {
  id: string
  country: string
  state: string
  city: string
  locality?: string
  
  name: string
  category: string
  vibes: Vibe[]
  
  latitude: number
  longitude: number
  
  images: string[]
  shortDescription: string
  longDescription?: string
  
  averageVisitTime?: string
  bestSeason?: string
  bestTime?: string
  entryFee?: string
  
  rating?: number
  crowdLevel?: string
  photographyScore?: number
  accessibility?: string
  
  tags?: string[]
  nearbyPlaces?: string[]
  
  googlePlaceId?: string
  openingHours?: string
  travelTips?: string[]
  famousFor?: string
  
  emotionScores: Partial<Record<Emotion, number>>
  hiddenGemScore: number
  popularityScore?: number
}

export type PlaceCategory = "historical" | "cultural" | "religious" | "food-markets" | "nature" | string

export interface RouteOption {
  id: string
  type: "metro" | "bus" | "taxi" | "walk"
  from: string
  to: string
  distance: number
  duration: number
  cost: number
  interchanges: number
  steps: RouteStep[]
}

export interface RouteStep {
  type: "metro" | "bus" | "taxi" | "walk"
  from: string
  to: string
  line?: string
  duration: number
  instruction: string
}

export interface ItineraryDay {
  day: number
  theme: string
  narrative: string
  places: Place[]
  totalDistance: number
  totalDuration: number
}

export interface Collection {
  id: string
  city: string
  title: string
  description: string
  coverImage: string
  places: string[] // Array of place IDs
}
