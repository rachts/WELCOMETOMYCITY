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

export interface Place {
  id: string
  name: string
  category: PlaceCategory
  lat: number
  lng: number
  description: string
  story: string
  emotionScores: Partial<Record<Emotion, number>>
  hiddenGemScore: number
  bestTime: string
  entryFee: string
  nearbyStation: string
  image: string
}

export type PlaceCategory = "historical" | "cultural" | "religious" | "food-markets" | "nature"

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
