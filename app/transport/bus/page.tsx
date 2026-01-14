"use client"

import { Suspense, useState, useMemo } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BusStopSelect } from "@/components/transport/bus-stop-select"
import { BusRouteCard } from "@/components/transport/bus-route-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRightLeft, Search, Bus, MapPin, Info, Snowflake } from "lucide-react"
import { getAllBusStops, findBusRoutes, getAllBusRoutes, type BusMatch } from "@/lib/bus-utils"
import Link from "next/link"

function BusPageContent() {
  const allStops = useMemo(() => getAllBusStops(), [])
  const allRoutes = useMemo(() => getAllBusRoutes(), [])

  const [fromStop, setFromStop] = useState("")
  const [toStop, setToStop] = useState("")
  const [busMatches, setBusMatches] = useState<BusMatch[]>([])
  const [selectedBus, setSelectedBus] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = () => {
    if (fromStop && toStop) {
      const matches = findBusRoutes(fromStop, toStop)
      setBusMatches(matches)
      setSelectedBus(matches[0]?.route.busNumber || null)
      setHasSearched(true)
    }
  }

  const handleSwap = () => {
    setFromStop(toStop)
    setToStop(fromStop)
    setBusMatches([])
    setHasSearched(false)
  }

  const acRoutes = allRoutes.filter((r) => r.type === "ac")
  const regularRoutes = allRoutes.filter((r) => r.type === "regular")

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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <Bus className="h-5 w-5 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold">Bus Routes</h1>
            </div>
            <p className="text-muted-foreground">
              Find WBTC bus routes across Kolkata - {allRoutes.length} routes covering {allStops.length}+ stops
            </p>
            <div className="mt-2">
              <Link href="/transport" className="text-sm text-primary hover:underline">
                ← Back to Transport Planner
              </Link>
            </div>
          </div>

          <Tabs defaultValue="search" className="space-y-6">
            <TabsList>
              <TabsTrigger value="search">Find Routes</TabsTrigger>
              <TabsTrigger value="all">All Routes ({allRoutes.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="search">
              <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
                {/* Search Panel */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Find Your Bus</CardTitle>
                      <CardDescription>Enter your starting point and destination</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">From</label>
                        <BusStopSelect
                          stops={allStops}
                          value={fromStop}
                          onSelect={setFromStop}
                          placeholder="Select starting stop"
                        />
                      </div>

                      <div className="flex justify-center">
                        <Button variant="ghost" size="icon" onClick={handleSwap} disabled={!fromStop && !toStop}>
                          <ArrowRightLeft className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">To</label>
                        <BusStopSelect
                          stops={allStops}
                          value={toStop}
                          onSelect={setToStop}
                          placeholder="Select destination stop"
                        />
                      </div>

                      <Button className="w-full gap-2" onClick={handleSearch} disabled={!fromStop || !toStop}>
                        <Search className="h-4 w-4" />
                        Find Buses
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Info Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Bus Travel Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <Snowflake className="h-4 w-4 text-blue-500 mt-0.5" />
                        <span>AC buses (prefixed with AC-) are more comfortable but cost more.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Bus className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Regular buses are cheaper and run more frequently.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-primary mt-0.5" />
                        <span>Most routes operate from 5:30 AM to 10:30 PM.</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Results Panel */}
                <div>
                  {!hasSearched ? (
                    <Card className="flex h-64 items-center justify-center">
                      <div className="text-center">
                        <Bus className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <p className="mt-4 text-muted-foreground">Select stops to find bus routes</p>
                      </div>
                    </Card>
                  ) : busMatches.length === 0 ? (
                    <Card className="flex h-64 items-center justify-center">
                      <div className="text-center px-4">
                        <Bus className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <p className="mt-4 text-muted-foreground">No direct bus routes found between these stops</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Try nearby stops or check the All Routes tab
                        </p>
                      </div>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Available Buses</h2>
                        <span className="text-sm text-muted-foreground">{busMatches.length} options found</span>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {busMatches.map((match) => (
                          <BusRouteCard
                            key={match.route.busNumber}
                            match={match}
                            isSelected={selectedBus === match.route.busNumber}
                            onSelect={() => setSelectedBus(match.route.busNumber)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="all">
              <div className="space-y-8">
                {/* AC Routes */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Snowflake className="h-5 w-5 text-blue-500" />
                    <h2 className="text-xl font-semibold">AC Bus Routes ({acRoutes.length})</h2>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {acRoutes.map((route) => (
                      <Card key={route.busNumber} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-base">
                            <Bus className="h-4 w-4 text-blue-500" />
                            {route.busNumber}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm font-medium">
                            {route.startPoint} → {route.endPoint}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {route.stops.length} stops • {route.frequency || "Regular service"}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Regular Routes */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Bus className="h-5 w-5 text-green-500" />
                    <h2 className="text-xl font-semibold">Regular Bus Routes ({regularRoutes.length})</h2>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {regularRoutes.map((route) => (
                      <Card key={route.busNumber} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-base">
                            <Bus className="h-4 w-4 text-green-500" />
                            {route.busNumber}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm font-medium">
                            {route.startPoint} → {route.endPoint}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {route.stops.length} stops • {route.frequency || "Regular service"}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function BusTransportPage() {
  return (
    <Suspense fallback={null}>
      <BusPageContent />
    </Suspense>
  )
}
