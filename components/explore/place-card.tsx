"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Ticket, Train, MapPin } from "lucide-react"
import type { Place, PlaceCategory } from "@/lib/types"

const categoryColors: Record<PlaceCategory, string> = {
  historical: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  cultural: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  religious: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  "food-markets": "bg-green-500/10 text-green-600 dark:text-green-400",
  nature: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
}

const categoryLabels: Record<PlaceCategory, string> = {
  historical: "Historical",
  cultural: "Cultural",
  religious: "Religious",
  "food-markets": "Food & Markets",
  nature: "Nature",
}

interface PlaceCardProps {
  place: Place
  onViewDetails: () => void
}

export function PlaceCard({ place, onViewDetails }: PlaceCardProps) {
  return (
    <Card className="group overflow-hidden border-border/50 transition-all hover:border-primary/50 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={
            place.image ||
            `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(place.name + " Kolkata landmark")}`
          }
          alt={place.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <Badge className={`absolute left-3 top-3 ${categoryColors[place.category]}`}>
          {categoryLabels[place.category]}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg">{place.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{place.description}</p>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{place.bestTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Ticket className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{place.entryFee}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Train className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Near {place.nearbyStation}</span>
          </div>
        </div>

        <Button className="mt-4 w-full gap-2 bg-transparent" variant="outline" onClick={onViewDetails}>
          <MapPin className="h-4 w-4" />
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}
