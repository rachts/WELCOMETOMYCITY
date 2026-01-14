"use client"

import { useState, Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DayCard } from "@/components/plan/day-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Sparkles, MapPin, Clock, Route, Printer, Info } from "lucide-react"
import { generateItinerary } from "@/lib/itinerary-generator"
import { useCity } from "@/lib/city-context"
import type { ItineraryDay } from "@/lib/types"

function PlanContent() {
  const { selectedCity } = useCity()
  const [selectedDays, setSelectedDays] = useState<1 | 2 | 3 | null>(null)
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([])

  const isKolkata = selectedCity.id === "kolkata"

  const handleGenerate = (days: 1 | 2 | 3) => {
    setSelectedDays(days)
    const generated = generateItinerary(days)
    setItinerary(generated)
  }

  const totalDistance = itinerary.reduce((acc, day) => acc + day.totalDistance, 0)
  const totalDuration = itinerary.reduce((acc, day) => acc + day.totalDuration, 0)
  const totalPlaces = itinerary.reduce((acc, day) => acc + day.places.length, 0)

  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">{selectedCity.name} Trip Planner</h1>
            </div>
            <p className="text-muted-foreground">Generate an optimized itinerary for your {selectedCity.name} visit</p>
          </div>

          {!isKolkata && (
            <Card className="mb-8 border-blue-500/50 bg-blue-500/5">
              <CardContent className="flex items-start gap-3 pt-6">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-600 dark:text-blue-400">
                    {selectedCity.name} Itineraries Coming Soon
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    We're building curated itineraries for {selectedCity.name}. Switch to Kolkata to try our AI-powered
                    trip planner!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {isKolkata ? (
            <>
              {/* Duration Selection */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>How many days are you visiting?</CardTitle>
                  <CardDescription>
                    Select your trip duration and we&apos;ll create the perfect itinerary
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[1, 2, 3].map((days) => (
                      <Button
                        key={days}
                        variant={selectedDays === days ? "default" : "outline"}
                        className={`h-auto flex-col gap-2 py-6 ${selectedDays !== days && "bg-transparent"}`}
                        onClick={() => handleGenerate(days as 1 | 2 | 3)}
                      >
                        <Calendar className="h-6 w-6" />
                        <span className="text-lg font-semibold">
                          {days} {days === 1 ? "Day" : "Days"}
                        </span>
                        <span className="text-xs opacity-70">
                          {days === 1 ? "Quick highlights" : days === 2 ? "Balanced tour" : "Complete experience"}
                        </span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Generated Itinerary */}
              {itinerary.length > 0 && (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-semibold">
                        Your {selectedDays}-Day {selectedCity.name} Itinerary
                      </h2>
                    </div>
                    <div className="flex gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{totalPlaces} places</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Route className="h-4 w-4" />
                        <span>{Math.round(totalDistance)} km</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{Math.floor(totalDuration / 60)}h total</span>
                      </div>
                    </div>
                  </div>

                  {/* Day Cards */}
                  <div className="space-y-6">
                    {itinerary.map((day) => (
                      <DayCard key={day.day} itinerary={day} />
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-center gap-4 pt-4">
                    <Button variant="outline" className="gap-2 bg-transparent" onClick={() => window.print()}>
                      <Printer className="h-4 w-4" />
                      Print Itinerary
                    </Button>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {itinerary.length === 0 && (
                <Card className="flex h-64 items-center justify-center">
                  <div className="text-center">
                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">Select trip duration to generate your itinerary</p>
                  </div>
                </Card>
              )}
            </>
          ) : (
            <Card className="flex h-64 items-center justify-center">
              <div className="text-center">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 font-medium">Plan Your {selectedCity.name} Trip</p>
                <p className="text-sm text-muted-foreground mt-1">Itinerary planner coming soon</p>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function PlanPage() {
  return (
    <Suspense fallback={null}>
      <PlanContent />
    </Suspense>
  )
}
