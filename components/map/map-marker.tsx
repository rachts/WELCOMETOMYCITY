"use client"

import * as React from "react"
import { Marker } from "react-map-gl/maplibre"
import { motion } from "framer-motion"
import { MapPin, Utensils, Sparkles, Building2 } from "lucide-react"
import type { Place } from "@/lib/types"

interface MapMarkerProps {
  place: Place
  isSelected: boolean
  onClick: () => void
}

export function MapMarker({ place, isSelected, onClick }: MapMarkerProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  
  // Determine style based on category/scores
  const isHiddenGem = place.hiddenGemScore > 0.7
  const isFood = place.category === "food-markets"
  
  let Icon = MapPin
  let glowColor = "bg-primary/20"
  let borderColor = "border-primary"
  let bgColor = "bg-primary"

  if (isHiddenGem) {
    Icon = Sparkles
    glowColor = "bg-indigo-500/30"
    borderColor = "border-indigo-500"
    bgColor = "bg-indigo-500"
  } else if (isFood) {
    Icon = Utensils
    glowColor = "bg-orange-500/30"
    borderColor = "border-orange-500"
    bgColor = "bg-orange-500"
  } else {
    Icon = Building2
    glowColor = "bg-cyan-500/30"
    borderColor = "border-cyan-500"
    bgColor = "bg-cyan-500"
  }

  return (
    <Marker
      longitude={place.lng}
      latitude={place.lat}
      anchor="bottom"
      onClick={e => {
        e.originalEvent.stopPropagation()
        onClick()
      }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: isSelected ? 1.3 : 1, 
          opacity: 1,
          zIndex: (isSelected || isHovered) ? 50 : 10 
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="cursor-pointer relative flex flex-col items-center"
      >
        {/* Floating Label */}
        {(isSelected || isHovered) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -45, scale: 1 }}
            className="absolute whitespace-nowrap px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold tracking-wider uppercase shadow-2xl pointer-events-none"
          >
            {place.name}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/80 border-r border-b border-white/10 rotate-45" />
          </motion.div>
        )}

        {/* Animated Glow */}
        {(isSelected || isHovered || isHiddenGem) && (
          <motion.div 
            className={`absolute inset-0 rounded-full blur-xl ${glowColor}`}
            animate={{ 
              scale: isHovered ? [1, 1.8, 1] : [1, 1.5, 1],
              opacity: isHovered ? 0.8 : 0.4
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Pin */}
        <div className={`p-2.5 rounded-full shadow-2xl backdrop-blur-md border transition-all duration-500 ${
          isSelected 
            ? `${bgColor} text-white ${borderColor} shadow-[0_0_20px_rgba(0,0,0,0.4)]` 
            : `bg-black/40 text-white border-white/20 hover:border-white/60`
        }`}>
          <Icon className="w-4 h-4" />
        </div>
      </motion.div>
    </Marker>
  )
}
