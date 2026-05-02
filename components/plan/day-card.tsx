"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Route, ArrowRight, MapPin, Quote } from "lucide-react"
import type { ItineraryDay, PlaceCategory } from "@/lib/types"

const categoryColors: Record<PlaceCategory, string> = {
  historical: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  cultural: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  religious: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  "food-markets": "bg-green-500/10 text-green-600 dark:text-green-400",
  nature: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
}

interface DayCardProps {
  itinerary: ItineraryDay
  modeColor?: string
}

export function DayCard({ itinerary, modeColor = "primary" }: DayCardProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins > 0 ? `${mins}m` : ""}`
  }

  const themeClasses = {
    "primary": "bg-primary/5 border-primary/20",
    "rose": "bg-rose-500/5 border-rose-500/20",
    "indigo": "bg-indigo-500/5 border-indigo-500/20",
    "amber": "bg-amber-500/5 border-amber-500/20",
    "orange": "bg-orange-500/5 border-orange-500/20",
  }[modeColor] || "bg-primary/5 border-primary/20"

  const iconColorClasses = {
    "primary": "text-primary bg-primary text-primary-foreground",
    "rose": "text-rose-500 bg-rose-500 text-white",
    "indigo": "text-indigo-500 bg-indigo-500 text-white",
    "amber": "text-amber-500 bg-amber-500 text-white",
    "orange": "text-orange-500 bg-orange-500 text-white",
  }[modeColor] || "text-primary bg-primary text-primary-foreground"

  return (
    <Card className={`overflow-hidden border-2 shadow-sm transition-all hover:shadow-md ${themeClasses}`}>
      <CardHeader className="pb-4 border-b border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-sm ${iconColorClasses.split(' ').filter(c => c.startsWith('bg-') || c.startsWith('text-')).join(' ')}`}>
                {itinerary.day}
              </span>
              {itinerary.theme}
            </CardTitle>
            <div className="flex items-start gap-2 mt-3 ml-1 text-muted-foreground">
              <Quote className={`w-5 h-5 shrink-0 opacity-40 mt-0.5 ${iconColorClasses.split(' ')[0]}`} />
              <p className="italic leading-relaxed">
                {itinerary.narrative}
              </p>
            </div>
          </div>
          
          <div className="flex shrink-0 gap-4 text-sm font-medium bg-background border px-4 py-2 rounded-lg shadow-sm">
            <div className="flex items-center gap-1.5">
              <Route className="h-4 w-4 text-muted-foreground" />
              {itinerary.totalDistance} km
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {formatDuration(itinerary.totalDuration)}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 bg-background">
        <div className="flex flex-col relative px-4 py-2">
          {/* Timeline connecting line */}
          <div className="absolute left-10 top-8 bottom-8 w-0.5 bg-border z-0" />
          
          {itinerary.places.map((place, index) => (
            <div key={place.id} className="flex gap-6 p-4 relative z-10 group">
              
              <div className="flex flex-col items-center pt-2">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full border-4 border-background shadow-sm text-sm font-bold transition-transform group-hover:scale-110 ${iconColorClasses.split(' ').filter(c => c.startsWith('bg-') || c.startsWith('text-')).join(' ')}`}>
                  {index + 1}
                </div>
              </div>
              
              <div className="flex-1 bg-muted/30 hover:bg-muted/60 transition-colors border rounded-xl p-4 flex flex-col md:flex-row gap-4">
                
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="font-bold text-lg">{place.name}</h4>
                    <Badge variant="secondary" className={`mt-1 font-medium ${categoryColors[place.category]}`}>
                      {place.category.replace("-", " ")}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {place.story || place.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-medium">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-background rounded-md border">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      {place.bestTime}
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-background rounded-md border">
                      <MapPin className={`h-3.5 w-3.5 ${iconColorClasses.split(' ')[0]}`} />
                      Near {place.nearbyStation}
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-48 h-32 md:h-auto shrink-0 rounded-lg overflow-hidden border shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>

              </div>

              {/* Transit instruction arrow for visual flow (optional, we keep it simple here) */}
              {index < itinerary.places.length - 1 && (
                <div className="absolute left-16 bottom-0 translate-y-1/2 flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground bg-background px-2 py-0.5 rounded-full border shadow-sm">
                  <ArrowRight className="h-3 w-3" />
                  Travel
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
