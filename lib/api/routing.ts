import type { Place } from "@/lib/types"

export async function getDirectionsRoute(places: Place[], profile: "walking" | "driving" = "driving") {
  if (places.length < 2) return null

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
  
  if (!mapboxToken) {
    console.warn("Mapbox token is missing. Falling back to straight lines.")
    return null
  }

  // Mapbox Directions API format: {longitude},{latitude};{longitude},{latitude}
  const coordinates = places.map(p => `${p.longitude},${p.latitude}`).join(';')
  
  const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}?geometries=geojson&access_token=${mapboxToken}`

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error("Failed to fetch directions")
    const data = await res.json()
    
    if (data.routes && data.routes.length > 0) {
      // Returns GeoJSON LineString coordinates and duration
      return {
        geometry: data.routes[0].geometry,
        durationSeconds: data.routes[0].duration,
        distanceMeters: data.routes[0].distance
      }
    }
  } catch (error) {
    console.error("Error fetching directions:", error)
  }
  
  return null
}
