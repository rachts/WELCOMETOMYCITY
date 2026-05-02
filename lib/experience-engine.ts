import { Place, ExperienceMode } from "./types"

/**
 * Experience Engine
 * Transforms mechanical place data into emotion-driven feeds.
 */

export function getPlacesForMode(places: Place[], mode: ExperienceMode | "all"): Place[] {
  if (mode === "all") return places

  let scoredPlaces = places.map((place) => {
    let matchScore = 0

    switch (mode) {
      case "romantic":
        // Prioritize romantic and peaceful, penalize chaotic
        const romantic = place.emotionScores.romantic || 0
        const peaceful = place.emotionScores.peaceful || 0
        const chaotic = place.emotionScores.chaotic || 0
        matchScore = (romantic * 1.5) + peaceful - (chaotic * 0.5)
        break

      case "hidden-gems":
        // Prioritize hiddenGemScore
        matchScore = place.hiddenGemScore * 2
        break

      case "cultural-deep-dive":
        matchScore = place.emotionScores.cultural || 0
        break

      case "food-crawl":
        // Fallback to category if we don't have explicit food emotion, 
        // though social/adventurous helps
        if (place.category === "food-markets") {
          matchScore = 2.0
        } else {
          matchScore = (place.emotionScores.social || 0) * 0.5
        }
        break
    }

    return { place, matchScore }
  })

  // Filter out negative or zero scores if we want strict mode matching
  // For now, let's just sort descending and maybe threshold
  scoredPlaces = scoredPlaces.filter(sp => sp.matchScore > 0.2)
  scoredPlaces.sort((a, b) => b.matchScore - a.matchScore)

  return scoredPlaces.map(sp => sp.place)
}

export function getModeColor(mode: ExperienceMode | "all"): string {
  switch (mode) {
    case "romantic": return "rose"
    case "hidden-gems": return "indigo"
    case "cultural-deep-dive": return "amber"
    case "food-crawl": return "orange"
    default: return "primary"
  }
}
