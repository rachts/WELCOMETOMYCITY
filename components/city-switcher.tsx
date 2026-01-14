"use client"

import { useCity } from "@/lib/city-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MapPin, ChevronDown, Check, Train } from "lucide-react"
import { cn } from "@/lib/utils"

export function CitySwitcher() {
  const { selectedCity, setSelectedCity, cities } = useCity()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="hidden sm:inline">{selectedCity.name}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[240px]">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Train className="h-4 w-4" />
          Select Your City
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto">
          {cities.map((city) => (
            <DropdownMenuItem
              key={city.id}
              onClick={() => setSelectedCity(city)}
              className={cn(
                "flex cursor-pointer items-center justify-between",
                selectedCity.id === city.id && "bg-primary/10",
              )}
            >
              <div className="flex flex-col">
                <span className="font-medium">{city.name}</span>
                <span className="text-xs text-muted-foreground">{city.state}</span>
              </div>
              <div className="flex items-center gap-2">
                {city.hasMetro && <span className="text-xs text-muted-foreground">{city.metroStations} stations</span>}
                {selectedCity.id === city.id && <Check className="h-4 w-4 text-primary" />}
              </div>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
