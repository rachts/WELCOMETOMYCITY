"use client"

import { useState, Suspense, useMemo } from "react"
import dynamic from 'next/dynamic'
import { Navbar } from "@/components/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { DayCard } from "@/components/plan/day-card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Sparkles, MapPin, Clock, Route, Printer, Heart, BookOpen, Utensils, BookmarkPlus } from "lucide-react"
import { generateItinerary } from "@/lib/itinerary-generator"
import { useCity } from "@/lib/city-context"
import { getModeColor } from "@/lib/experience-engine"
import type { ItineraryDay, ExperienceMode, Place } from "@/lib/types"
import { saveItinerary } from "./actions"

const CityMap = dynamic(() => import('@/components/map/city-map').then(mod => mod.CityMap), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#05070B]">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
})

const MODES: { id: ExperienceMode | "all", label: string, icon: any }[] = [
  { id: "all", label: "Balanced", icon: MapPin },
  { id: "romantic", label: "Romantic", icon: Heart },
  { id: "hidden-gems", label: "Hidden Gems", icon: Sparkles },
  { id: "cultural-deep-dive", label: "Cultural", icon: BookOpen },
  { id: "food-crawl", label: "Food Crawl", icon: Utensils }
]

import { Input } from "@/components/ui/input"

export function PlanClient({ initialPlaces }: { initialPlaces: Place[] }) {
  const { selectedCity } = useCity()
  const [selectedDays, setSelectedDays] = useState<1 | 2 | 3 | null>(null)
  const [selectedMode, setSelectedMode] = useState<ExperienceMode | "all">("all")
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([])
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [itineraryName, setItineraryName] = useState("")

  const isKolkata = selectedCity.id === "kolkata"
  const basePlaces = isKolkata ? initialPlaces : []

  const handleGenerate = () => {
    if (!selectedDays || basePlaces.length === 0) return
    const generated = generateItinerary(basePlaces, selectedDays, selectedMode)
    setItinerary(generated)
    setSelectedPlace(null) // Reset selection on new generation
    
    // Default name
    const modeLabel = MODES.find(m => m.id === selectedMode)?.label || "City"
    setItineraryName(`${modeLabel} Journey in ${selectedCity.name}`)
  }

  const themeColor = getModeColor(selectedMode)
  
  const themeClasses = {
    "primary": "bg-primary text-primary-foreground shadow-[0_0_20px_-5px_rgba(0,240,255,0.4)]",
    "rose": "bg-rose-500 text-white shadow-[0_0_20px_-5px_rgba(244,63,94,0.4)]",
    "indigo": "bg-indigo-500 text-white shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]",
    "amber": "bg-amber-500 text-white shadow-[0_0_20px_-5px_rgba(251,191,36,0.4)]",
    "orange": "bg-orange-500 text-white shadow-[0_0_20px_-5px_rgba(249,115,22,0.4)]",
  }[themeColor] || "bg-primary text-primary-foreground"

  // Aggregate all places from all days for the map to render and connect routes
  const allItineraryPlaces = useMemo(() => {
    return itinerary.flatMap(day => day.places)
  }, [itinerary])

  const totalDistance = itinerary.reduce((acc, day) => acc + day.totalDistance, 0)
  const totalDuration = itinerary.reduce((acc, day) => acc + day.totalDuration, 0)
  const totalPlaces = allItineraryPlaces.length

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#05070B] relative">
      {/* BACKGROUND CANVAS: The Map */}
      <div className="absolute inset-0 z-0">
        <CityMap 
          places={allItineraryPlaces} 
          mode={selectedMode}
          onPlaceSelect={setSelectedPlace}
          selectedPlaceId={selectedPlace?.id}
          showRoutes={allItineraryPlaces.length > 0}
        />
      </div>

      {/* FOREGROUND OVERLAY: Floating UI */}
      <div className="relative z-10 w-full h-full pointer-events-none flex pt-24 px-4 pb-4 md:px-8">
        
        {/* Left Side Panel (Controls & Itinerary) */}
        <div className="w-full md:w-[480px] h-full flex flex-col gap-4 pointer-events-auto">
          
          {/* Top Control Panel */}
          {isKolkata && itinerary.length === 0 && (
            <GlassCard glowColor={themeColor} className="shrink-0 p-6 flex flex-col gap-6 animate-in slide-in-from-left duration-500">
              <div>
                <h2 className="text-xl font-bold mb-1">Trip Intelligence</h2>
                <p className="text-sm text-white/50">Configure your emotional routing parameters.</p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50">Duration</label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((days) => (
                    <Button
                      key={days}
                      variant="ghost"
                      className={`h-12 border ${
                        selectedDays === days 
                          ? "bg-white/10 border-white/30 text-white" 
                          : "bg-black/20 border-white/5 text-white/50 hover:bg-white/5"
                      }`}
                      onClick={() => setSelectedDays(days as 1 | 2 | 3)}
                    >
                      {days} {days === 1 ? "Day" : "Days"}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50">Experience Vibe</label>
                <div className="grid grid-cols-3 gap-2">
                  {MODES.map((m) => (
                    <Button
                      key={m.id}
                      variant="ghost"
                      className={`h-16 flex-col gap-1 border ${
                        selectedMode === m.id 
                          ? "bg-white/10 border-white/30 text-white" 
                          : "bg-black/20 border-white/5 text-white/50 hover:bg-white/5"
                      }`}
                      onClick={() => setSelectedMode(m.id)}
                    >
                      <m.icon className="w-4 h-4" />
                      <span className="text-[10px]">{m.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                size="lg" 
                disabled={!selectedDays || basePlaces.length === 0}
                onClick={handleGenerate}
                className={`w-full h-14 mt-2 rounded-xl font-bold text-base transition-all duration-300 ${themeClasses}`}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Itinerary
              </Button>
            </GlassCard>
          )}

          {/* Generated Itinerary Panel */}
          {itinerary.length > 0 && (
            <GlassCard glowColor={themeColor} className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-700">
              <div className="p-5 border-b border-white/10 bg-black/40 flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <Input 
                    value={itineraryName}
                    onChange={(e) => setItineraryName(e.target.value)}
                    placeholder="Name your journey..."
                    className="bg-transparent border-none text-xl font-bold p-0 focus-visible:ring-0 placeholder:text-white/20 h-auto"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-white/70 flex items-center gap-1.5">
                      {(() => {
                        const ModeIcon = MODES.find(m => m.id === selectedMode)?.icon || MapPin;
                        return <ModeIcon className="w-3.5 h-3.5" />
                      })()}
                      {MODES.find(m => m.id === selectedMode)?.label} Vibe
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={async () => {
                          const res = await saveItinerary(itineraryName, selectedCity.name, selectedMode, selectedDays!, itinerary)
                          if (res.error) alert(res.error)
                          else alert('Itinerary saved!')
                        }} 
                        className="h-8 px-3 text-xs bg-white/5 border-white/10 hover:bg-white/10 text-white"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5 mr-1" /> Save
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setItinerary([])} className="h-8 px-2 text-xs text-white/50 hover:text-white">
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 text-xs font-medium bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-white/50" />
                    <span>{totalPlaces} stops</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Route className="h-3.5 w-3.5 text-white/50" />
                    <span>{Math.round(totalDistance)} km</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-white/50" />
                    <span>{Math.floor(totalDuration / 60)}h</span>
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-6 pb-6">
                  {itinerary.map((day) => (
                    <DayCard key={day.day} itinerary={day} modeColor={themeColor} />
                  ))}
                </div>
              </ScrollArea>
            </GlassCard>
          )}

        </div>
      </div>
    </div>
  )
}
