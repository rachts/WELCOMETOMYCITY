"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type CityData, cities, getCityById } from "@/lib/data/cities"

interface CityContextType {
  selectedCity: CityData
  setSelectedCity: (city: CityData) => void
  cities: CityData[]
}

const CityContext = createContext<CityContextType | undefined>(undefined)

export function CityProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCityState] = useState<CityData>(cities[0])

  useEffect(() => {
    // Load saved city from localStorage on mount
    const savedCityId = localStorage.getItem("welcometomycity-selected-city")
    if (savedCityId) {
      const city = getCityById(savedCityId)
      if (city) {
        setSelectedCityState(city)
      }
    }
  }, [])

  const setSelectedCity = (city: CityData) => {
    setSelectedCityState(city)
    localStorage.setItem("welcometomycity-selected-city", city.id)
  }

  return <CityContext.Provider value={{ selectedCity, setSelectedCity, cities }}>{children}</CityContext.Provider>
}

export function useCity() {
  const context = useContext(CityContext)
  if (context === undefined) {
    throw new Error("useCity must be used within a CityProvider")
  }
  return context
}
