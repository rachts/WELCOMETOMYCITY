"use client"

import { useState, useMemo } from "react"
import Map, { NavigationControl } from "react-map-gl/maplibre"
import { MapMarker } from "./map-marker"
import { RouteLayer } from "./route-layer"
import type { Place, ExperienceMode } from "@/lib/types"
import "maplibre-gl/dist/maplibre-gl.css"

interface CityMapProps {
  places: Place[]
  mode?: ExperienceMode | "all"
  onPlaceSelect: (place: Place) => void
  selectedPlaceId?: string
  showRoutes?: boolean
}

// Using Carto's free Dark Matter style which perfectly fits our #05070B aesthetic without needing an API key immediately.
const DARK_MATTER_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"

export function CityMap({ places, mode = "all", onPlaceSelect, selectedPlaceId, showRoutes = false }: CityMapProps) {
  const [viewState, setViewState] = useState({
    longitude: 88.3639, // Default to Kolkata
    latitude: 22.5726,
    zoom: 12,
    pitch: 45, // Add some 3D pitch for cinematic feel
    bearing: -17.6
  })

  // Smoothly animate to selected place
  useMemo(() => {
    if (places.length > 0 && selectedPlaceId) {
      const selected = places.find(p => p.id === selectedPlaceId)
      if (selected) {
        setViewState(prev => ({
          ...prev,
          longitude: selected.lng,
          latitude: selected.lat,
          zoom: 15,
          transitionDuration: 1000 // Smooth fly to
        }))
      }
    } else if (places.length > 0 && !selectedPlaceId) {
      // If we have places but no selection, center on the first place
      setViewState(prev => ({
        ...prev,
        longitude: places[0].lng,
        latitude: places[0].lat,
        zoom: 12,
        transitionDuration: 1000
      }))
    }
  }, [places, selectedPlaceId])

  // Determine route color based on mode
  const routeColor = {
    "romantic": "#fb7185", // rose-400
    "hidden-gems": "#818cf8", // indigo-400
    "cultural-deep-dive": "#fbbf24", // amber-400
    "food-crawl": "#fb923c", // orange-400
    "all": "#00f0ff" // cyan
  }[mode] || "#00f0ff"

  return (
    <div className="absolute inset-0 w-full h-full bg-[#05070B]">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle={DARK_MATTER_STYLE}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false} // Clean look
        interactiveLayerIds={['places']}
      >
        <NavigationControl position="bottom-right" showCompass={false} />

        {/* Route Line */}
        {showRoutes && <RouteLayer places={places} routeColor={routeColor} />}

        {/* Markers */}
        {places.map((place) => (
          <MapMarker
            key={place.id}
            place={place}
            isSelected={selectedPlaceId === place.id}
            onClick={() => onPlaceSelect(place)}
          />
        ))}
      </Map>
    </div>
  )
}
