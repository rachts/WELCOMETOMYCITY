"use client"

import * as React from "react"
import { Source, Layer } from "react-map-gl/maplibre"
import type { LineLayer } from "react-map-gl/maplibre"
import type { Place } from "@/lib/types"

interface RouteLayerProps {
  places: Place[]
  routeColor?: string
}

export function RouteLayer({ places, routeColor = "#00f0ff" }: RouteLayerProps) {
  if (places.length < 2) return null

  // Convert places to a GeoJSON LineString
  const geojson = React.useMemo(() => {
    return {
      type: "Feature" as const,
      properties: {},
      geometry: {
        type: "LineString" as const,
        coordinates: places.map(p => [p.lng, p.lat])
      }
    }
  }, [places])

  const lineStyle: LineLayer = {
    id: "route-line",
    type: "line",
    source: "route",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": routeColor,
      "line-width": 4,
      "line-opacity": 0.8,
      "line-dasharray": [0, 2] // Will animate this later if needed, but MapLibre native dash array
    }
  }

  // A subtle glow layer underneath the main line
  const glowStyle: LineLayer = {
    id: "route-glow",
    type: "line",
    source: "route",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": routeColor,
      "line-width": 12,
      "line-opacity": 0.2,
      "line-blur": 8
    }
  }

  return (
    <>
      <Source id="route" type="geojson" data={geojson}>
        <Layer {...glowStyle} />
        <Layer {...lineStyle} />
      </Source>
    </>
  )
}
