"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Train, Bus, Car, Footprints, Clock, Wallet, ArrowRight, GitBranch } from "lucide-react"
import { cn } from "@/lib/utils"
import type { RouteOption } from "@/lib/types"

const transportIcons = {
  metro: Train,
  bus: Bus,
  taxi: Car,
  walk: Footprints,
}

const transportColors = {
  metro: "text-blue-500 bg-blue-500/10",
  bus: "text-green-500 bg-green-500/10",
  taxi: "text-yellow-500 bg-yellow-500/10",
  walk: "text-purple-500 bg-purple-500/10",
}

interface RouteCardProps {
  route: RouteOption
  isSelected: boolean
  onSelect: () => void
  isFastest?: boolean
  isCheapest?: boolean
}

export function RouteCard({ route, isSelected, onSelect, isFastest, isCheapest }: RouteCardProps) {
  const Icon = transportIcons[route.type]
  const colorClass = transportColors[route.type]

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
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", colorClass)}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg capitalize">{route.type}</CardTitle>
              <p className="text-sm text-muted-foreground">{route.distance} km</p>
            </div>
          </div>
          <div className="flex gap-1">
            {isFastest && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Fastest
              </Badge>
            )}
            {isCheapest && (
              <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                Cheapest
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-lg font-semibold">{route.duration}</span>
            <span className="text-xs text-muted-foreground">min</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <span className="text-lg font-semibold">₹{route.cost}</span>
            <span className="text-xs text-muted-foreground">fare</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <GitBranch className="h-4 w-4 text-muted-foreground" />
            <span className="text-lg font-semibold">{route.interchanges}</span>
            <span className="text-xs text-muted-foreground">changes</span>
          </div>
        </div>

        {/* Route Steps */}
        <div className="mt-4 space-y-2">
          {route.steps.map((step, index) => {
            const StepIcon = transportIcons[step.type]
            return (
              <div key={index} className="flex items-center gap-2 text-sm">
                <StepIcon className={cn("h-4 w-4", transportColors[step.type].split(" ")[0])} />
                <span className="text-muted-foreground">{step.instruction}</span>
                {index < route.steps.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
