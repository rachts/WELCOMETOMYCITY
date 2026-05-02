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
  
  // Determine style based on category/scores
  const isHiddenGem = place.hiddenGemScore > 0.7
  const isFood = place.category === "food-markets"
  
  let Icon = MapPin
  let glowColor = "bg-primary/20"
  let borderColor = "border-primary"
  let iconColor = "text-primary-foreground"
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
        animate={{ scale: isSelected ? 1.3 : 1, opacity: 1 }}
        whileHover={{ scale: 1.2 }}
        className={`cursor-pointer relative flex items-center justify-center ${
          isSelected ? "z-50" : "z-10"
        }`}
      >
        {/* Animated Glow */}
        {(isSelected || isHiddenGem) && (
          <motion.div 
            className={`absolute inset-0 rounded-full blur-md ${glowColor}`}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Pin */}
        <div className={`p-2 rounded-full shadow-2xl backdrop-blur-md border ${
          isSelected 
            ? `${bgColor} text-white ${borderColor}` 
            : `bg-black/60 text-white border-white/20 hover:${borderColor}`
        } transition-colors duration-300`}>
          <Icon className="w-4 h-4" />
        </div>
      </motion.div>
    </Marker>
  )
}
