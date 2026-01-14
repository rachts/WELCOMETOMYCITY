"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Route, ArrowRight, Train } from "lucide-react"
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
}

export function DayCard({ itinerary }: DayCardProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins > 0 ? `${mins}m` : ""}`
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
              {itinerary.day}
            </span>
            Day {itinerary.day}
          </CardTitle>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Route className="h-4 w-4" />
              {itinerary.totalDistance} km
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDuration(itinerary.totalDuration)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {itinerary.places.map((place, index) => (
            <div key={place.id} className="flex gap-4 p-4">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background text-sm font-medium">
                  {index + 1}
                </div>
                {index < itinerary.places.length - 1 && <div className="mt-2 h-full w-0.5 bg-border" />}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold">{place.name}</h4>
                    <Badge className={`mt-1 ${categoryColors[place.category]}`}>
                      {place.category.replace("-", " ")}
                    </Badge>
                  </div>
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={`/.jpg?height=64&width=96&query=${encodeURIComponent(place.name + " Kolkata")}`}
                      alt={place.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{place.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {place.bestTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Train className="h-3 w-3 text-primary" />
                    {place.nearbyStation}
                  </div>
                </div>
                {index < itinerary.places.length - 1 && (
                  <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                    <ArrowRight className="h-3 w-3" />
                    Travel to next location via Metro/Bus
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
