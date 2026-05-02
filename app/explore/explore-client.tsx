"use client"

import { useState, useMemo, Suspense, useEffect } from "react"
import dynamic from 'next/dynamic'
import { Navbar } from "@/components/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Heart, Sparkles, BookOpen, Utensils, Info, BookmarkPlus } from "lucide-react"
import { useCity } from "@/lib/city-context"
import { getPlacesForMode, getModeColor } from "@/lib/experience-engine"
import type { Place, ExperienceMode } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"
import { savePlace } from "./actions"

// Dynamically import map to avoid SSR issues with MapLibre
const CityMap = dynamic(() => import('@/components/map/city-map').then(mod => mod.CityMap), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#05070B]">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
})

const MODES: { id: ExperienceMode | "all", label: string, icon: any, desc: string }[] = [
  { id: "all", label: "Discover", icon: MapPin, desc: "Explore all places" },
  { id: "romantic", label: "Romantic Evening", icon: Heart, desc: "Sunset spots & low crowds" },
  { id: "hidden-gems", label: "Hidden Gems", icon: Sparkles, desc: "Offbeat & local secrets" },
  { id: "cultural-deep-dive", label: "Cultural Deep Dive", icon: BookOpen, desc: "Heritage & history" },
  { id: "food-crawl", label: "Food Crawl", icon: Utensils, desc: "Culinary adventures" }
]

export function ExploreClient({ initialPlaces }: { initialPlaces: Place[] }) {
  const { selectedCity } = useCity()
  const [mode, setMode] = useState<ExperienceMode | "all">("all")
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)

  const isKolkata = selectedCity.id === "kolkata"
  // If we had more cities in the DB, we would filter or fetch them dynamically.
  // For now, initialPlaces contains the Supabase places.
  const basePlaces = isKolkata ? initialPlaces : []

  const feedPlaces = useMemo(() => {
    return getPlacesForMode(basePlaces, mode)
  }, [basePlaces, mode])

  useEffect(() => {
    if (selectedPlace && !feedPlaces.find(p => p.id === selectedPlace.id)) {
      setSelectedPlace(null)
    }
  }, [mode, feedPlaces, selectedPlace])

  const themeColor = getModeColor(mode)
  
  const textThemeClasses = {
    "primary": "text-primary",
    "rose": "text-rose-400",
    "indigo": "text-indigo-400",
    "amber": "text-amber-400",
    "orange": "text-orange-400",
  }[themeColor] || "text-primary"

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#05070B] relative">
      {/* BACKGROUND CANVAS: The Map */}
      <div className="absolute inset-0 z-0">
        <CityMap 
          places={feedPlaces} 
          mode={mode} 
          onPlaceSelect={setSelectedPlace}
          selectedPlaceId={selectedPlace?.id}
          showRoutes={false}
        />
      </div>

      {/* FOREGROUND OVERLAY: Floating UI */}
      <div className="relative z-10 w-full h-full pointer-events-none flex flex-col md:flex-row pt-20 px-4 pb-4 md:pt-24 md:px-8 gap-6">
        
        {/* Left Sidebar (Modes & Feed) */}
        <div className="w-full md:w-[400px] h-full flex flex-col gap-4 pointer-events-auto">
          
          {/* Mode Selector */}
          <GlassCard glowColor={themeColor} className="shrink-0 p-4">
            <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-white/70" /> Experience Modes
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {MODES.map((m) => {
                const isSelected = mode === m.id;
                const Icon = m.icon;
                return (
                  <Button
                    key={m.id}
                    variant="ghost"
                    className={`h-auto flex flex-col items-start p-3 gap-1 rounded-xl transition-all duration-300 ${
                      isSelected 
                        ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                        : "hover:bg-white/5 text-muted-foreground hover:text-white"
                    } ${m.id === 'all' ? 'col-span-2 flex-row items-center justify-center' : ''}`}
                    onClick={() => setMode(m.id)}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Icon className={`w-4 h-4 ${isSelected ? textThemeClasses : ""}`} />
                      <span className="font-semibold">{m.label}</span>
                    </div>
                  </Button>
                )
              })}
            </div>
          </GlassCard>

          {/* Place Feed */}
          <GlassCard className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
              <h2 className="font-bold">Curated Feed</h2>
              <span className="text-xs text-white/50 font-medium px-2 py-1 bg-white/5 rounded-full border border-white/10">
                {feedPlaces.length} places
              </span>
            </div>
            <ScrollArea className="flex-1 p-4">
              {feedPlaces.length > 0 ? (
                <div className="flex flex-col gap-3 pb-8">
                  {feedPlaces.map((place) => (
                    <motion.div 
                      key={place.id}
                      layoutId={`card-${place.id}`}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedPlace(place)}
                      className={`cursor-pointer rounded-xl border p-3 transition-colors ${
                        selectedPlace?.id === place.id ? "bg-white/10 border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.05)]" : "bg-black/40 hover:bg-white/5 border-white/5"
                      }`}
                    >
                      <div className="flex gap-3 h-20">
                        <div className="w-20 shrink-0 rounded-lg overflow-hidden bg-black/50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col justify-between py-1 overflow-hidden">
                          <div>
                            <h4 className="font-semibold text-sm line-clamp-1 text-white/90">{place.name}</h4>
                            <p className="text-xs text-white/50 line-clamp-1">{place.category}</p>
                          </div>
                          {mode !== "all" && (
                            <div className={`text-[10px] font-medium w-fit px-1.5 py-0.5 rounded bg-white/5 border border-white/10 ${textThemeClasses}`}>
                              {mode === 'hidden-gems' ? `${Math.round(place.hiddenGemScore * 100)}% Match` : 'Highly Recommended'}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-50">
                  <MapPin className="w-8 h-8 mb-2" />
                  <p className="text-sm">No places found for this mode in {selectedCity.name}.</p>
                </div>
              )}
            </ScrollArea>
          </GlassCard>

        </div>

        {/* Right Area (Floating Place Details Card) */}
        <div className="flex-1 h-full flex items-end justify-end pointer-events-none pb-4">
          <AnimatePresence>
            {selectedPlace && (
              <motion.div
                initial={{ opacity: 0, x: 20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 20, y: 20 }}
                className="pointer-events-auto"
              >
                <GlassCard glowColor={themeColor} className="w-full md:w-96 p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-xl leading-tight pr-2">{selectedPlace.name}</h3>
                    <div className="flex gap-1 shrink-0">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full hover:bg-white/10 text-white/50 hover:text-primary transition-colors" 
                        onClick={async () => {
                          const res = await savePlace(selectedPlace.id)
                          if (res.error) alert(res.error)
                          else alert('Saved to your Trips!')
                        }}
                        title="Save to My Trips"
                      >
                        <BookmarkPlus className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10" onClick={() => setSelectedPlace(null)}>
                        &times;
                      </Button>
                    </div>
                  </div>
                  <div className="h-40 w-full rounded-xl overflow-hidden mb-4 relative shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selectedPlace.image} alt={selectedPlace.name} className="object-cover w-full h-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                      <span className="text-xs font-medium px-2 py-1 bg-black/60 backdrop-blur-md rounded-md border border-white/10">
                        {selectedPlace.bestTime}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Info className={`w-4 h-4 shrink-0 mt-0.5 ${textThemeClasses}`} />
                    <p className="text-white/70 italic leading-relaxed">
                      "{selectedPlace.story || selectedPlace.description}"
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}
