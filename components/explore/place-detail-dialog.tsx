"use client"

import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Clock, Ticket, Train, MapPin, ExternalLink, Navigation } from "lucide-react"
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

interface PlaceDetailDialogProps {
  place: Place | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PlaceDetailDialog({ place, open, onOpenChange }: PlaceDetailDialogProps) {
  if (!place) return null

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <DialogTitle className="text-2xl">{place.name}</DialogTitle>
            <Badge className={categoryColors[place.category]}>{categoryLabels[place.category]}</Badge>
          </div>
        </DialogHeader>

        <div className="relative h-64 overflow-hidden rounded-lg">
          <Image
            src={
              place.image ||
              `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(place.name + " Kolkata landmark")}`
            }
            alt={place.name}
            fill
            className="object-cover"
          />
        </div>

        <p className="text-muted-foreground">{place.description}</p>

        <Separator />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Best Time to Visit</p>
                <p className="text-sm text-muted-foreground">{place.bestTime}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Ticket className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Entry Fee</p>
                <p className="text-sm text-muted-foreground">{place.entryFee}</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Train className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Nearest Metro</p>
                <p className="text-sm text-muted-foreground">{place.nearbyStation} Station</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-muted-foreground">
                  {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button asChild className="flex-1 gap-2">
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation className="h-4 w-4" />
              Open in Maps
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
          <Button variant="outline" asChild className="flex-1 gap-2 bg-transparent">
            <Link href={`/transport`}>
              <Train className="h-4 w-4" />
              Plan Route
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
