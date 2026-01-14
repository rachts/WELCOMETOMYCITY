"use client"

import { useState, useMemo, Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { StationSelect } from "@/components/transport/station-select"
import { RouteCard } from "@/components/transport/route-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRightLeft, Search, Train, MapPin, Bus, ArrowRight, Info } from "lucide-react"
import { getAllStations, calculateRoutes } from "@/lib/route-calculator"
import { findBusRoutes, type BusMatch } from "@/lib/bus-utils"
import { BusRouteCard } from "@/components/transport/bus-route-card"
import { useCity } from "@/lib/city-context"
import type { RouteOption } from "@/lib/types"
import Link from "next/link"

function TransportContent() {
  const { selectedCity } = useCity()
  const stations = useMemo(() => getAllStations(), [])
  const [fromStation, setFromStation] = useState("")
  const [toStation, setToStation] = useState("")
  const [routes, setRoutes] = useState<RouteOption[]>([])
  const [busMatches, setBusMatches] = useState<BusMatch[]>([])
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const isKolkata = selectedCity.id === "kolkata"

  const handleSearch = () => {
    const from = stations.find((s) => s.id === fromStation)
    const to = stations.find((s) => s.id === toStation)

    if (from && to) {
      const calculatedRoutes = calculateRoutes(from, to)
      setRoutes(calculatedRoutes)
      setSelectedRoute(calculatedRoutes[0]?.id || null)

      const buses = findBusRoutes(from.name, to.name)
      setBusMatches(buses.slice(0, 3))

      setHasSearched(true)
    }
  }

  const handleSwap = () => {
    setFromStation(toStation)
    setToStation(fromStation)
    setRoutes([])
    setBusMatches([])
    setHasSearched(false)
  }

  const fastestRoute = routes.length > 0 ? routes.reduce((a, b) => (a.duration < b.duration ? a : b)) : null
  const cheapestRoute = routes.length > 0 ? routes.reduce((a, b) => (a.cost < b.cost ? a : b)) : null

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
                <Train className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">{selectedCity.name} Transport Planner</h1>
            </div>
            <p className="text-muted-foreground">Compare routes across Metro, Bus, Taxi, and Walking</p>
          </div>

          {!isKolkata && (
            <Card className="mb-8 border-blue-500/50 bg-blue-500/5">
              <CardContent className="flex items-start gap-3 pt-6">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-600 dark:text-blue-400">{selectedCity.name} Data Coming Soon</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    We're currently building detailed transport data for {selectedCity.name}.{selectedCity.name} has{" "}
                    {selectedCity.metroLines} metro line(s) with {selectedCity.metroStations} stations. Full route
                    planning will be available soon!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {isKolkata ? (
            <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
              {/* Search Panel */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Plan Your Journey</CardTitle>
                    <CardDescription>Select your starting point and destination</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">From</label>
                      <StationSelect
                        stations={stations}
                        value={fromStation}
                        onSelect={setFromStation}
                        placeholder="Select starting station"
                      />
                    </div>

                    <div className="flex justify-center">
                      <Button variant="ghost" size="icon" onClick={handleSwap} disabled={!fromStation && !toStation}>
                        <ArrowRightLeft className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">To</label>
                      <StationSelect
                        stations={stations}
                        value={toStation}
                        onSelect={setToStation}
                        placeholder="Select destination station"
                      />
                    </div>

                    <Button className="w-full gap-2" onClick={handleSearch} disabled={!fromStation || !toStation}>
                      <Search className="h-4 w-4" />
                      Find Routes
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Quick Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <Train className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>Metro runs 7 AM - 10:45 PM. Best for long distances.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Bus className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Buses cover more areas but can be slower in traffic.</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-green-500/5 border-green-500/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Bus className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Looking for Bus Routes?</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Explore 80+ WBTC bus routes with detailed stop information.
                    </p>
                    <Link href="/transport/bus">
                      <Button variant="outline" className="w-full gap-2 bg-transparent">
                        View All Bus Routes
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>

              {/* Results Panel */}
              <div>
                {!hasSearched ? (
                  <Card className="flex h-64 items-center justify-center">
                    <div className="text-center">
                      <MapPin className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-muted-foreground">Select stations to compare routes</p>
                    </div>
                  </Card>
                ) : routes.length === 0 ? (
                  <Card className="flex h-64 items-center justify-center">
                    <div className="text-center">
                      <p className="text-muted-foreground">No routes found between these stations</p>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {/* Transport Modes */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Available Routes</h2>
                        <span className="text-sm text-muted-foreground">{routes.length} options found</span>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {routes.map((route) => (
                          <RouteCard
                            key={route.id}
                            route={route}
                            isSelected={selectedRoute === route.id}
                            onSelect={() => setSelectedRoute(route.id)}
                            isFastest={fastestRoute?.id === route.id}
                            isCheapest={cheapestRoute?.id === route.id && cheapestRoute?.id !== fastestRoute?.id}
                          />
                        ))}
                      </div>
                    </div>

                    {busMatches.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Bus className="h-5 w-5 text-green-500" />
                            Bus Alternatives
                          </h2>
                          <Link href="/transport/bus" className="text-sm text-primary hover:underline">
                            View all buses →
                          </Link>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {busMatches.map((match) => (
                            <BusRouteCard key={match.route.busNumber} match={match} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Placeholder for other cities */
            <Card className="flex h-64 items-center justify-center">
              <div className="text-center">
                <Train className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 font-medium">{selectedCity.name} Metro</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedCity.metroLines} lines • {selectedCity.metroStations} stations
                </p>
                <p className="text-sm text-muted-foreground mt-4">
                  Detailed route data coming soon. Switch to Kolkata for full features.
                </p>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function TransportPage() {
  return (
    <Suspense fallback={null}>
      <TransportContent />
    </Suspense>
  )
}
