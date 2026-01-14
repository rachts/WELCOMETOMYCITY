"use client"

import { useState, useMemo, Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PlaceCard } from "@/components/explore/place-card"
import { CategoryFilter } from "@/components/explore/category-filter"
import { PlaceDetailDialog } from "@/components/explore/place-detail-dialog"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Search, Info } from "lucide-react"
import { useCity } from "@/lib/city-context"
import placesData from "@/lib/data/places.json"
import type { Place, PlaceCategory } from "@/lib/types"

const places: Place[] = placesData.places as Place[]

function ExploreContent() {
  const { selectedCity } = useCity()
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const isKolkata = selectedCity.id === "kolkata"

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      const matchesCategory = selectedCategory === "all" || place.category === selectedCategory
      const matchesSearch =
        searchQuery === "" ||
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  const handleViewDetails = (place: Place) => {
    setSelectedPlace(place)
    setDialogOpen(true)
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <MapPin className="h-5 w-5 text-accent" />
          </div>
          <h1 className="text-3xl font-bold">Explore {selectedCity.name}</h1>
        </div>
        <p className="text-muted-foreground">{selectedCity.tagline} - Discover iconic landmarks and hidden gems</p>
      </div>

      {!isKolkata && (
        <Card className="mb-8 border-blue-500/50 bg-blue-500/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium text-blue-600 dark:text-blue-400">{selectedCity.name} Places Coming Soon</p>
              <p className="text-sm text-muted-foreground mt-1">
                We're adding tourist attractions for {selectedCity.name}. Switch to Kolkata to explore our full database
                of places!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isKolkata && (
        <>
          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
          </div>

          {/* Results */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredPlaces.length} {filteredPlaces.length === 1 ? "place" : "places"}
            </p>
          </div>
        </>
      )}

      {isKolkata ? (
        filteredPlaces.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No places found matching your criteria</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} onViewDetails={() => handleViewDetails(place)} />
            ))}
          </div>
        )
      ) : (
        <Card className="flex h-64 items-center justify-center">
          <div className="text-center">
            <MapPin className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 font-medium">Explore {selectedCity.name}</p>
            <p className="text-sm text-muted-foreground mt-1">Tourist attractions data coming soon</p>
          </div>
        </Card>
      )}

      <PlaceDetailDialog place={selectedPlace} open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}

export default function ExplorePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <Suspense fallback={null}>
            <ExploreContent />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  )
}
