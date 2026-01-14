import stationsData from "@/lib/data/stations.json"
import { transportTypes } from "@/lib/data/transport-types"
import type { RouteOption, Station } from "@/lib/types"

const stations: Station[] = stationsData.stations

export function findStation(query: string): Station | undefined {
  const q = query.toLowerCase()
  return stations.find((s) => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q))
}

export function getAllStations(): Station[] {
  return stations
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function calculateRoutes(fromStation: Station, toStation: Station): RouteOption[] {
  const distance = calculateDistance(fromStation.lat, fromStation.lng, toStation.lat, toStation.lng)
  const routes: RouteOption[] = []

  // Metro Route
  const metroTime = Math.ceil((distance / transportTypes.metro.avgSpeed) * 60)
  const metroFare = Math.ceil(transportTypes.metro.baseFare + distance * transportTypes.metro.perKmFare)
  const sameLineMetro = fromStation.lines.some((line) => toStation.lines.includes(line))

  routes.push({
    id: "metro",
    type: "metro",
    from: fromStation.name,
    to: toStation.name,
    distance: Math.round(distance * 10) / 10,
    duration: metroTime + (sameLineMetro ? 0 : 5), // Add 5 min for interchange
    cost: metroFare,
    interchanges: sameLineMetro ? 0 : 1,
    steps: [
      {
        type: "walk",
        from: "Start",
        to: fromStation.name,
        duration: 5,
        instruction: `Walk to ${fromStation.name} Metro Station`,
      },
      {
        type: "metro",
        from: fromStation.name,
        to: toStation.name,
        line: fromStation.lines[0],
        duration: metroTime,
        instruction: `Take ${fromStation.lines[0].toUpperCase()} line to ${toStation.name}`,
      },
      {
        type: "walk",
        from: toStation.name,
        to: "Destination",
        duration: 3,
        instruction: "Walk to your destination",
      },
    ],
  })

  // Bus Route (slightly longer, cheaper)
  const busTime = Math.ceil((distance / transportTypes.bus.avgSpeed) * 60)
  const busFare = Math.ceil(transportTypes.bus.baseFare + distance * transportTypes.bus.perKmFare)

  routes.push({
    id: "bus",
    type: "bus",
    from: fromStation.name,
    to: toStation.name,
    distance: Math.round(distance * 1.2 * 10) / 10,
    duration: busTime + 10, // Wait time
    cost: busFare,
    interchanges: distance > 5 ? 1 : 0,
    steps: [
      {
        type: "walk",
        from: "Start",
        to: "Bus Stop",
        duration: 5,
        instruction: "Walk to the nearest bus stop",
      },
      {
        type: "bus",
        from: "Bus Stop",
        to: "Destination Stop",
        duration: busTime,
        instruction: `Take bus towards ${toStation.name} area`,
      },
      {
        type: "walk",
        from: "Bus Stop",
        to: "Destination",
        duration: 5,
        instruction: "Walk to your destination",
      },
    ],
  })

  // Taxi Route (fastest, most expensive)
  const taxiTime = Math.ceil((distance / transportTypes.taxi.avgSpeed) * 60)
  const taxiFare = Math.ceil(transportTypes.taxi.baseFare + distance * transportTypes.taxi.perKmFare)

  routes.push({
    id: "taxi",
    type: "taxi",
    from: fromStation.name,
    to: toStation.name,
    distance: Math.round(distance * 10) / 10,
    duration: taxiTime,
    cost: taxiFare,
    interchanges: 0,
    steps: [
      {
        type: "taxi",
        from: fromStation.name,
        to: toStation.name,
        duration: taxiTime,
        instruction: `Take taxi/auto directly to ${toStation.name}`,
      },
    ],
  })

  // Walking (only for short distances)
  if (distance < 3) {
    const walkTime = Math.ceil((distance / transportTypes.walk.avgSpeed) * 60)
    routes.push({
      id: "walk",
      type: "walk",
      from: fromStation.name,
      to: toStation.name,
      distance: Math.round(distance * 10) / 10,
      duration: walkTime,
      cost: 0,
      interchanges: 0,
      steps: [
        {
          type: "walk",
          from: fromStation.name,
          to: toStation.name,
          duration: walkTime,
          instruction: `Walk directly to ${toStation.name}`,
        },
      ],
    })
  }

  return routes.sort((a, b) => a.duration - b.duration)
}
