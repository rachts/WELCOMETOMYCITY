"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Bus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface BusStopSelectProps {
  stops: string[]
  value: string
  onSelect: (value: string) => void
  placeholder?: string
}

export function BusStopSelect({ stops, value, onSelect, placeholder = "Select stop..." }: BusStopSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredStops = React.useMemo(() => {
    if (!searchQuery) return stops.slice(0, 50)
    const query = searchQuery.toLowerCase()
    return stops.filter((stop) => stop.toLowerCase().includes(query)).slice(0, 50)
  }, [stops, searchQuery])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          <div className="flex items-center gap-2 truncate">
            <Bus className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="truncate">{value || placeholder}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search bus stop..." value={searchQuery} onValueChange={setSearchQuery} />
          <CommandList>
            <CommandEmpty>No stop found.</CommandEmpty>
            <CommandGroup>
              {filteredStops.map((stop) => (
                <CommandItem
                  key={stop}
                  value={stop}
                  onSelect={() => {
                    onSelect(stop)
                    setOpen(false)
                    setSearchQuery("")
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === stop ? "opacity-100" : "opacity-0")} />
                  {stop}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
