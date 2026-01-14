export interface CityData {
  id: string
  name: string
  state: string
  tagline: string
  description: string
  hasMetro: boolean
  metroLines: number
  metroStations: number
  population: string
  primaryColor: string
}

export const cities: CityData[] = [
  {
    id: "kolkata",
    name: "Kolkata",
    state: "West Bengal",
    tagline: "The City of Joy",
    description:
      "Experience the cultural capital of India with its rich heritage, colonial architecture, and vibrant street life.",
    hasMetro: true,
    metroLines: 2,
    metroStations: 24,
    population: "14.8M",
    primaryColor: "teal",
  },
  {
    id: "delhi",
    name: "Delhi",
    state: "Delhi NCR",
    tagline: "The Heart of India",
    description:
      "Explore the national capital blending Mughal heritage with modern infrastructure and the largest metro network in India.",
    hasMetro: true,
    metroLines: 12,
    metroStations: 286,
    population: "32M",
    primaryColor: "red",
  },
  {
    id: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    tagline: "The City of Dreams",
    description:
      "Navigate India's financial capital with its iconic local trains, expanding metro, and endless opportunities.",
    hasMetro: true,
    metroLines: 3,
    metroStations: 45,
    population: "21M",
    primaryColor: "blue",
  },
  {
    id: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    tagline: "The Gateway to South India",
    description:
      "Discover the cultural hub of South India with ancient temples, beautiful beaches, and delicious cuisine.",
    hasMetro: true,
    metroLines: 2,
    metroStations: 40,
    population: "11M",
    primaryColor: "purple",
  },
  {
    id: "bangalore",
    name: "Bangalore",
    state: "Karnataka",
    tagline: "The Silicon Valley of India",
    description:
      "Experience India's tech capital with its pleasant weather, innovative startups, and growing metro network.",
    hasMetro: true,
    metroLines: 2,
    metroStations: 55,
    population: "13M",
    primaryColor: "green",
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    tagline: "The City of Pearls",
    description: "Explore the historic Nizam city with iconic Charminar, Biriyani, and cutting-edge IT corridor.",
    hasMetro: true,
    metroLines: 3,
    metroStations: 57,
    population: "10M",
    primaryColor: "yellow",
  },
  {
    id: "ahmedabad",
    name: "Ahmedabad",
    state: "Gujarat",
    tagline: "The Manchester of India",
    description:
      "Discover India's first UNESCO World Heritage City with its textile heritage and Sabarmati Riverfront.",
    hasMetro: true,
    metroLines: 2,
    metroStations: 32,
    population: "8M",
    primaryColor: "orange",
  },
  {
    id: "pune",
    name: "Pune",
    state: "Maharashtra",
    tagline: "The Oxford of the East",
    description: "Navigate the educational and cultural hub with its pleasant climate and emerging metro network.",
    hasMetro: true,
    metroLines: 2,
    metroStations: 30,
    population: "7M",
    primaryColor: "indigo",
  },
  {
    id: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    tagline: "The Pink City",
    description: "Explore the royal capital of Rajasthan with majestic forts, palaces, and vibrant bazaars.",
    hasMetro: true,
    metroLines: 2,
    metroStations: 11,
    population: "4M",
    primaryColor: "pink",
  },
  {
    id: "lucknow",
    name: "Lucknow",
    state: "Uttar Pradesh",
    tagline: "The City of Nawabs",
    description: "Experience the city of tehzeeb with its Mughal architecture, kebabs, and rich cultural heritage.",
    hasMetro: true,
    metroLines: 1,
    metroStations: 21,
    population: "3.5M",
    primaryColor: "amber",
  },
  {
    id: "kochi",
    name: "Kochi",
    state: "Kerala",
    tagline: "The Queen of Arabian Sea",
    description: "Discover the port city with its Chinese fishing nets, colonial heritage, and backwater gateway.",
    hasMetro: true,
    metroLines: 1,
    metroStations: 22,
    population: "2.1M",
    primaryColor: "cyan",
  },
  {
    id: "nagpur",
    name: "Nagpur",
    state: "Maharashtra",
    tagline: "The Orange City",
    description: "Explore the geographic center of India with its tiger reserves and rapidly expanding metro.",
    hasMetro: true,
    metroLines: 2,
    metroStations: 36,
    population: "2.9M",
    primaryColor: "orange",
  },
]

export function getCityById(id: string): CityData | undefined {
  return cities.find((city) => city.id === id)
}

export function getCityByName(name: string): CityData | undefined {
  return cities.find((city) => city.name.toLowerCase() === name.toLowerCase())
}
