"use client"

import { useState, useMemo, Suspense, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PlaceCard } from "@/components/explore/place-card"
import { CategoryFilter } from "@/components/explore/category-filter"
import { PlaceDetailDialog } from "@/components/explore/place-detail-dialog"
import { GeneratePlacesButton } from "@/components/explore/generate-places-button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Search, Sparkles } from "lucide-react"
import { useCity } from "@/lib/city-context"
import { generateCityPlaces } from "@/lib/actions/generate-places"
import kolkataPlacesData from "@/lib/data/places.json"
import type { Place, PlaceCategory } from "@/lib/types"

const kolkataPlaces: Place[] = kolkataPlacesData.places as Place[]

function ExploreContent() {
  const { selectedCity } = useCity()
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const [generatedPlaces, setGeneratedPlaces] = useState<Record<string, Place[]>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isKolkata = selectedCity.id === "kolkata"

  const currentPlaces = isKolkata ? kolkataPlaces : generatedPlaces[selectedCity.id] || []

  const hasPlaces = currentPlaces.length > 0

  const filteredPlaces = useMemo(() => {
    return currentPlaces.filter((place) => {
      const matchesCategory = selectedCategory === "all" || place.category === selectedCategory
      const matchesSearch =
        searchQuery === "" ||
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [currentPlaces, selectedCategory, searchQuery])

  const handleViewDetails = (place: Place) => {
    setSelectedPlace(place)
    setDialogOpen(true)
  }

  const handleGeneratePlaces = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const result = await generateCityPlaces(selectedCity.id)

      if (result.error) {
        setError(result.error)
      } else {
        setGeneratedPlaces((prev) => ({
          ...prev,
          [selectedCity.id]: result.places,
        }))
      }
    } catch (err) {
      setError("Failed to generate places. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    setSelectedCategory("all")
    setSearchQuery("")
    setError(null)
  }, [selectedCity.id])

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

      {!isKolkata && !hasPlaces && (
        <Card className="mb-8 border-primary/50 bg-primary/5">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg">Discover {selectedCity.name} with AI</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                Generate a curated list of famous tourist attractions, landmarks, and hidden gems in {selectedCity.name}{" "}
                using AI.
              </p>
            </div>
            <GeneratePlacesButton
              cityName={selectedCity.name}
              onGenerate={handleGeneratePlaces}
              isGenerating={isGenerating}
            />
            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          </CardContent>
        </Card>
      )}

      {!isKolkata && hasPlaces && (
        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardContent className="flex items-center gap-3 py-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-medium">AI-Generated:</span>{" "}
                <span className="text-muted-foreground">
                  {currentPlaces.length} places discovered for {selectedCity.name}
                </span>
              </p>
            </div>
            <GeneratePlacesButton
              cityName={selectedCity.name}
              onGenerate={handleGeneratePlaces}
              isGenerating={isGenerating}
            />
          </CardContent>
        </Card>
      )}

      {/* Search and Filter - show when we have places */}
      {hasPlaces && (
        <>
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

          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredPlaces.length} {filteredPlaces.length === 1 ? "place" : "places"}
            </p>
          </div>
        </>
      )}

      {/* Places Grid */}
      {hasPlaces ? (
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
      ) : isKolkata ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
          <div className="text-center">
            <MapPin className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">Loading places...</p>
          </div>
        </div>
      ) : null}

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
