import placesData from "@/lib/data/places.json"
import type { Place, ItineraryDay } from "@/lib/types"
import { calculateDistance } from "@/lib/route-calculator"

const places: Place[] = placesData.places as Place[]

// Organize places by category for balanced itineraries
const placesByCategory = {
  historical: places.filter((p) => p.category === "historical"),
  cultural: places.filter((p) => p.category === "cultural"),
  religious: places.filter((p) => p.category === "religious"),
  "food-markets": places.filter((p) => p.category === "food-markets"),
  nature: places.filter((p) => p.category === "nature"),
}

function optimizeRoute(selectedPlaces: Place[]): Place[] {
  if (selectedPlaces.length <= 1) return selectedPlaces

  // Simple nearest-neighbor optimization
  const optimized: Place[] = [selectedPlaces[0]]
  const remaining = [...selectedPlaces.slice(1)]

  while (remaining.length > 0) {
    const last = optimized[optimized.length - 1]
    let nearestIdx = 0
    let nearestDist = Number.POSITIVE_INFINITY

    remaining.forEach((place, idx) => {
      const dist = calculateDistance(last.lat, last.lng, place.lat, place.lng)
      if (dist < nearestDist) {
        nearestDist = dist
        nearestIdx = idx
      }
    })

    optimized.push(remaining[nearestIdx])
    remaining.splice(nearestIdx, 1)
  }

  return optimized
}

function calculateTotalDistance(orderedPlaces: Place[]): number {
  let total = 0
  for (let i = 0; i < orderedPlaces.length - 1; i++) {
    total += calculateDistance(
      orderedPlaces[i].lat,
      orderedPlaces[i].lng,
      orderedPlaces[i + 1].lat,
      orderedPlaces[i + 1].lng,
    )
  }
  return Math.round(total * 10) / 10
}

export function generateItinerary(days: 1 | 2 | 3): ItineraryDay[] {
  const itinerary: ItineraryDay[] = []

  if (days === 1) {
    // One day: Cover iconic spots
    const dayPlaces = [
      placesByCategory.historical[0], // Victoria Memorial
      placesByCategory.historical[1], // Howrah Bridge
      placesByCategory["food-markets"][0], // New Market
      placesByCategory.cultural[0], // Indian Museum
    ].filter(Boolean)

    const optimized = optimizeRoute(dayPlaces)
    itinerary.push({
      day: 1,
      places: optimized,
      totalDistance: calculateTotalDistance(optimized),
      totalDuration: optimized.length * 90, // 90 min avg per place
    })
  } else if (days === 2) {
    // Day 1: Historical & Cultural
    const day1Places = [
      placesByCategory.historical[0],
      placesByCategory.cultural[0],
      placesByCategory["food-markets"][0],
      placesByCategory.cultural[1],
    ].filter(Boolean)

    const optimized1 = optimizeRoute(day1Places)
    itinerary.push({
      day: 1,
      places: optimized1,
      totalDistance: calculateTotalDistance(optimized1),
      totalDuration: optimized1.length * 90,
    })

    // Day 2: Religious & Nature
    const day2Places = [
      placesByCategory.religious[0],
      placesByCategory.religious[1],
      placesByCategory.nature[0],
      placesByCategory["food-markets"][1],
    ].filter(Boolean)

    const optimized2 = optimizeRoute(day2Places)
    itinerary.push({
      day: 2,
      places: optimized2,
      totalDistance: calculateTotalDistance(optimized2),
      totalDuration: optimized2.length * 90,
    })
  } else {
    // Day 1: Historical Tour
    const day1Places = [
      placesByCategory.historical[0],
      placesByCategory.historical[1],
      placesByCategory.historical[2],
      placesByCategory["food-markets"][0],
    ].filter(Boolean)

    const optimized1 = optimizeRoute(day1Places)
    itinerary.push({
      day: 1,
      places: optimized1,
      totalDistance: calculateTotalDistance(optimized1),
      totalDuration: optimized1.length * 90,
    })

    // Day 2: Cultural & Religious
    const day2Places = [
      placesByCategory.cultural[0],
      placesByCategory.cultural[1],
      placesByCategory.religious[0],
      placesByCategory["food-markets"][1],
    ].filter(Boolean)

    const optimized2 = optimizeRoute(day2Places)
    itinerary.push({
      day: 2,
      places: optimized2,
      totalDistance: calculateTotalDistance(optimized2),
      totalDuration: optimized2.length * 90,
    })

    // Day 3: Nature & More
    const day3Places = [
      placesByCategory.nature[0],
      placesByCategory.nature[1],
      placesByCategory.religious[1],
      placesByCategory.cultural[2],
    ].filter(Boolean)

    const optimized3 = optimizeRoute(day3Places)
    itinerary.push({
      day: 3,
      places: optimized3,
      totalDistance: calculateTotalDistance(optimized3),
      totalDuration: optimized3.length * 90,
    })
  }

  return itinerary
}
