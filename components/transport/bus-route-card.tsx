"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bus, Clock, Wallet, MapPin, ArrowRight, Snowflake } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BusMatch } from "@/lib/bus-utils"

interface BusRouteCardProps {
  match: BusMatch
  isSelected?: boolean
  onSelect?: () => void
}

export function BusRouteCard({ match, isSelected, onSelect }: BusRouteCardProps) {
  const { route, stopsInBetween, estimatedDuration, estimatedFare } = match
  const isAC = route.type === "ac"

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isSelected ? "border-primary ring-2 ring-primary/20" : "border-border/50",
      )}
      onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                isAC ? "bg-blue-500/10" : "bg-green-500/10",
              )}
            >
              <Bus className={cn("h-5 w-5", isAC ? "text-blue-500" : "text-green-500")} />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                Bus {route.busNumber}
                {isAC && (
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 gap-1">
                    <Snowflake className="h-3 w-3" />
                    AC
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {route.startPoint} → {route.endPoint}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div className="flex flex-col items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-lg font-semibold">{estimatedDuration}</span>
            <span className="text-xs text-muted-foreground">min</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <span className="text-lg font-semibold">₹{estimatedFare}</span>
            <span className="text-xs text-muted-foreground">fare</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-lg font-semibold">{stopsInBetween.length}</span>
            <span className="text-xs text-muted-foreground">stops</span>
          </div>
        </div>

        {/* Route Preview */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Route Preview</p>
          <div className="flex flex-wrap items-center gap-1 text-sm">
            {stopsInBetween.slice(0, 4).map((stop, index) => (
              <span key={index} className="flex items-center gap-1">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs",
                    index === 0 || index === stopsInBetween.length - 1
                      ? "bg-primary/10 text-primary font-medium"
                      : "bg-muted",
                  )}
                >
                  {stop}
                </span>
                {index < Math.min(3, stopsInBetween.length - 1) && (
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                )}
              </span>
            ))}
            {stopsInBetween.length > 4 && (
              <span className="text-xs text-muted-foreground">+{stopsInBetween.length - 4} more stops</span>
            )}
          </div>
        </div>

        {/* Frequency & Operating Hours */}
        {(route.frequency || route.operatingHours) && (
          <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
            {route.frequency && <span>{route.frequency}</span>}
            {route.frequency && route.operatingHours && <span className="mx-2">•</span>}
            {route.operatingHours && <span>{route.operatingHours}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
