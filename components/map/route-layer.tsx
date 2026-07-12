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
  const [routeGeometry, setRouteGeometry] = React.useState<any>(null)

  React.useEffect(() => {
    async function fetchRoute() {
      if (places.length < 2) {
        setRouteGeometry(null)
        return
      }

      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
      if (!mapboxToken) {
        // Fallback to straight lines if no token
        setRouteGeometry({
          type: "LineString",
          coordinates: places.map(p => [p.longitude, p.latitude])
        })
        return
      }

      const coordinates = places.map(p => `${p.longitude},${p.latitude}`).join(';')
      const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${coordinates}?geometries=geojson&access_token=${mapboxToken}`

      try {
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          if (data.routes && data.routes.length > 0) {
            setRouteGeometry(data.routes[0].geometry)
            return
          }
        }
      } catch (err) {
        console.error("Failed to fetch route", err)
      }

      // Fallback on error
      setRouteGeometry({
        type: "LineString",
        coordinates: places.map(p => [p.longitude, p.latitude])
      })
    }

    fetchRoute()
  }, [places])

  if (places.length < 2 || !routeGeometry) return null

  const geojson = {
    type: "Feature" as const,
    properties: {},
    geometry: routeGeometry
  }

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
      "line-dasharray": [0, 2]
    }
  }

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
    <Source id="route" type="geojson" data={geojson}>
      <Layer {...glowStyle} />
      <Layer {...lineStyle} />
    </Source>
  )
}
