"use client"

import { useState, useMemo } from "react"
import { Check, ChevronsUpDown, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Station } from "@/lib/types"

interface StationSelectProps {
  stations: Station[]
  value: string
  onSelect: (stationId: string) => void
  placeholder: string
}

export function StationSelect({ stations, value, onSelect, placeholder }: StationSelectProps) {
  const [open, setOpen] = useState(false)

  const selectedStation = useMemo(() => stations.find((s) => s.id === value), [stations, value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            {selectedStation ? selectedStation.name : placeholder}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search station..." />
          <CommandList>
            <CommandEmpty>No station found.</CommandEmpty>
            <CommandGroup>
              {stations.map((station) => (
                <CommandItem
                  key={station.id}
                  value={station.name}
                  onSelect={() => {
                    onSelect(station.id)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === station.id ? "opacity-100" : "opacity-0")} />
                  <div className="flex flex-col">
                    <span>{station.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {station.lines.map((l) => l.toUpperCase()).join(", ")} Line
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
