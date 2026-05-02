import type { Place, ItineraryDay, ExperienceMode } from "@/lib/types"
import { calculateDistance } from "@/lib/route-calculator"
import { getPlacesForMode } from "@/lib/experience-engine"

function optimizeRoute(selectedPlaces: Place[]): Place[] {
  if (selectedPlaces.length <= 1) return selectedPlaces

  // Simple nearest-neighbor optimization starting from the first place
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

function generateNarrative(mode: ExperienceMode | "all", places: Place[], day: number): { theme: string; narrative: string } {
  const names = places.map(p => p.name).join(", ")
  
  if (mode === "romantic") {
    return {
      theme: `Day ${day}: Love & Serenity`,
      narrative: `Begin your day with a calm escape, soaking in the peaceful atmosphere. As the afternoon wanes, transition towards scenic views and golden hour magic. Today's journey takes you through ${names}, curated specifically for low crowds and high emotional resonance.`
    }
  }
  if (mode === "hidden-gems") {
    return {
      theme: `Day ${day}: Uncovering Secrets`,
      narrative: `Step away from the tourist traps and dive into the authentic soul of the city. Today is about discovery—walking through less-trodden paths to find true local flavor. You will explore highly-rated but quiet offbeat locations, including ${names}.`
    }
  }
  if (mode === "cultural-deep-dive") {
    return {
      theme: `Day ${day}: Echoes of the Past`,
      narrative: `Immerse yourself in centuries of history, architecture, and art. Today's narrative arc moves from monumental heritage sites to bustling intellectual hubs. Walk the halls of the past as you visit ${names}.`
    }
  }
  if (mode === "food-crawl") {
    return {
      theme: `Day ${day}: A Culinary Adventure`,
      narrative: `Prepare your palate for a journey through the city's chaotic and vibrant food markets. From early morning street stalls to historic dining hubs, you'll experience the intense social energy of ${names}.`
    }
  }
  
  // Default (all)
  return {
    theme: `Day ${day}: City Highlights`,
    narrative: `A balanced exploration of the city's most iconic spots. Transition seamlessly from historic landmarks to bustling modern hubs as you explore ${names}.`
  }
}

export function generateItinerary(
  places: Place[],
  days: 1 | 2 | 3, 
  mode: ExperienceMode | "all"
): ItineraryDay[] {
  // 1. Filter places based on mode
  const filteredPlaces = getPlacesForMode(places, mode)
  
  // We need roughly 3-4 places per day
  const placesPerDay = 3
  const itinerary: ItineraryDay[] = []

  for (let i = 0; i < days; i++) {
    // Slice the top matching places for this day
    const startIndex = i * placesPerDay
    // If we run out of places, just loop back or stop. For now, just slice what we have.
    const dayPlacesUnoptimized = scoredPlaces.slice(startIndex, startIndex + placesPerDay)
    
    if (dayPlacesUnoptimized.length === 0) break

    // 2. Distance optimization within the selected emotional cohort
    const optimizedPlaces = optimizeRoute(dayPlacesUnoptimized)
    
    // 3. Generate narrative storytelling
    const { theme, narrative } = generateNarrative(mode, optimizedPlaces, i + 1)

    itinerary.push({
      day: i + 1,
      theme,
      narrative,
      places: optimizedPlaces,
      totalDistance: calculateTotalDistance(optimizedPlaces),
      // 90 mins avg per place
      totalDuration: optimizedPlaces.length * 90, 
    })
  }

  return itinerary
}
