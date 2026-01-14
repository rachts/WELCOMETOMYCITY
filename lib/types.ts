export interface Station {
  id: string
  name: string
  lat: number
  lng: number
  lines: string[]
}

export interface Place {
  id: string
  name: string
  category: PlaceCategory
  lat: number
  lng: number
  description: string
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
  places: Place[]
  totalDistance: number
  totalDuration: number
}
