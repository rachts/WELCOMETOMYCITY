"use client"

import { Button } from "@/components/ui/button"
import { Landmark, BookOpen, Church, ShoppingBag, TreePine } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PlaceCategory } from "@/lib/types"

const categories: { id: PlaceCategory | "all"; label: string; icon: typeof Landmark }[] = [
  { id: "all", label: "All Places", icon: Landmark },
  { id: "historical", label: "Historical", icon: Landmark },
  { id: "cultural", label: "Cultural", icon: BookOpen },
  { id: "religious", label: "Religious", icon: Church },
  { id: "food-markets", label: "Food & Markets", icon: ShoppingBag },
  { id: "nature", label: "Nature", icon: TreePine },
]

interface CategoryFilterProps {
  selected: PlaceCategory | "all"
  onSelect: (category: PlaceCategory | "all") => void
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const Icon = category.icon
        const isSelected = selected === category.id
        return (
          <Button
            key={category.id}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className={cn("gap-2", !isSelected && "bg-transparent")}
            onClick={() => onSelect(category.id)}
          >
            <Icon className="h-4 w-4" />
            {category.label}
          </Button>
        )
      })}
    </div>
  )
}
