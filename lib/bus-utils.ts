import busesData from "@/lib/data/buses.json"

export interface BusRoute {
  busNumber: string
  startPoint: string
  endPoint: string
  stops: string[]
  frequency?: string
  operatingHours?: string
  type: "regular" | "ac"
}

export interface BusMatch {
  route: BusRoute
  fromIndex: number
  toIndex: number
  stopsInBetween: string[]
  estimatedDuration: number
  estimatedFare: number
}

const buses: BusRoute[] = busesData.routes

// Normalize stop names for matching
function normalizeStop(stop: string): string {
  return stop
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .replace(/crossing|xing|more|junction|jn|station|stn/gi, "")
    .trim()
}

// Check if a query matches a stop name
function matchesStop(query: string, stop: string): boolean {
  const normalizedQuery = normalizeStop(query)
  const normalizedStop = normalizeStop(stop)

  // Exact match
  if (normalizedStop === normalizedQuery) return true

  // Partial match (query contains stop or stop contains query)
  if (normalizedStop.includes(normalizedQuery) || normalizedQuery.includes(normalizedStop)) return true

  // Word-based match
  const queryWords = normalizedQuery.split(" ")
  const stopWords = normalizedStop.split(" ")

  return queryWords.some((qw) => stopWords.some((sw) => sw.includes(qw) || qw.includes(sw)))
}

// Find stop index in a route
function findStopIndex(stops: string[], query: string): number {
  for (let i = 0; i < stops.length; i++) {
    if (matchesStop(query, stops[i])) return i
  }
  return -1
}

// Calculate estimated duration based on stops
function calculateDuration(stopsCount: number, isAC: boolean): number {
  // Average 3-4 minutes per stop for regular, 2-3 for AC
  const avgMinutesPerStop = isAC ? 2.5 : 3.5
  return Math.ceil(stopsCount * avgMinutesPerStop)
}

// Calculate estimated fare
function calculateFare(stopsCount: number, isAC: boolean): number {
  if (isAC) {
    // AC buses: base ₹30 + ₹2 per stop
    return Math.min(30 + stopsCount * 2, 80)
  } else {
    // Regular buses: base ₹8 + ₹1 per stop
    return Math.min(8 + stopsCount * 1, 25)
  }
}

// Find all bus routes between two locations
export function findBusRoutes(from: string, to: string): BusMatch[] {
  const matches: BusMatch[] = []

  for (const route of buses) {
    const fromIndex = findStopIndex(route.stops, from)
    const toIndex = findStopIndex(route.stops, to)

    // Both stops must exist and fromIndex must be before toIndex (correct direction)
    if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
      const stopsInBetween = route.stops.slice(fromIndex, toIndex + 1)
      const isAC = route.type === "ac"

      matches.push({
        route,
        fromIndex,
        toIndex,
        stopsInBetween,
        estimatedDuration: calculateDuration(stopsInBetween.length, isAC),
        estimatedFare: calculateFare(stopsInBetween.length, isAC),
      })
    }
  }

  // Sort by estimated duration (fastest first)
  return matches.sort((a, b) => a.estimatedDuration - b.estimatedDuration)
}

// Get all unique stops for autocomplete
export function getAllBusStops(): string[] {
  const stopsSet = new Set<string>()

  for (const route of buses) {
    for (const stop of route.stops) {
      stopsSet.add(stop)
    }
  }

  return Array.from(stopsSet).sort()
}

// Get all bus routes
export function getAllBusRoutes(): BusRoute[] {
  return buses
}

// Search stops by query
export function searchBusStops(query: string): string[] {
  if (!query || query.length < 2) return []

  const allStops = getAllBusStops()
  const normalizedQuery = normalizeStop(query)

  return allStops.filter((stop) => normalizeStop(stop).includes(normalizedQuery)).slice(0, 10)
}
