export const transportTypes = {
  metro: {
    id: "metro",
    name: "Metro",
    icon: "Train",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    avgSpeed: 35, // km/h
    baseFare: 5,
    perKmFare: 1.5,
  },
  bus: {
    id: "bus",
    name: "Bus",
    icon: "Bus",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    avgSpeed: 18, // km/h in city traffic
    baseFare: 7,
    perKmFare: 0.8,
  },
  taxi: {
    id: "taxi",
    name: "Taxi / Auto",
    icon: "Car",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    avgSpeed: 22, // km/h
    baseFare: 25,
    perKmFare: 12,
  },
  walk: {
    id: "walk",
    name: "Walking",
    icon: "Footprints",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    avgSpeed: 5, // km/h
    baseFare: 0,
    perKmFare: 0,
  },
} as const

export type TransportType = keyof typeof transportTypes
