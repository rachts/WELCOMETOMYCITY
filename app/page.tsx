"use client"

import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ModeCard } from "@/components/mode-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCity } from "@/lib/city-context"
import { Train, MapPin, Calendar, ArrowRight, Clock, Wallet, Route, Building2 } from "lucide-react"
import Link from "next/link"

function HomeContent() {
  const { selectedCity, cities } = useCity()

  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background pb-16 pt-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{cities.length} Metro Cities Covered</span>
              </div>
              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                <span className="text-primary">WELCOME</span>TO
                <br />
                <span className="text-accent">{selectedCity.name.toUpperCase()}</span>
              </h1>
              <p className="mx-auto mt-4 text-lg text-muted-foreground">{selectedCity.tagline}</p>
              <p className="mx-auto mt-2 max-w-2xl text-pretty text-muted-foreground">{selectedCity.description}</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/transport">
                    Plan Route
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/explore">Explore {selectedCity.name}</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -left-20 top-1/2 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-20 top-1/3 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        </section>

        {/* Features */}
        <section className="border-y border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Real-time Comparison</h3>
                  <p className="text-sm text-muted-foreground">Compare travel time across modes</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Cost Estimates</h3>
                  <p className="text-sm text-muted-foreground">Know fares before you travel</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Route className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Multi-City Support</h3>
                  <p className="text-sm text-muted-foreground">Navigate any major Indian metro</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mode Selection */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold">Explore {selectedCity.name}</h2>
              <p className="mt-2 text-muted-foreground">
                Whether you&apos;re commuting or exploring, we&apos;ve got you covered
              </p>
            </div>
            <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
              <ModeCard
                href="/transport"
                icon={Train}
                title="Transport Planner"
                description="Find the best route using Metro, Bus, Taxi, or on foot"
                gradient="bg-gradient-to-br from-primary/20 to-primary/5"
              />
              <ModeCard
                href="/explore"
                icon={MapPin}
                title="City Explorer"
                description="Discover historical sites, temples, markets, and parks"
                gradient="bg-gradient-to-br from-accent/20 to-accent/5"
              />
              <ModeCard
                href="/plan"
                icon={Calendar}
                title="Trip Planner"
                description="Create optimized 1-3 day itineraries for your visit"
                gradient="bg-gradient-to-br from-muted to-muted/50"
              />
            </div>
          </div>
        </section>

        {/* City Stats */}
        <section className="border-t border-border bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold">{selectedCity.name} at a Glance</h2>
            </div>
            <div className="grid gap-8 text-center sm:grid-cols-4">
              <div>
                <div className="text-4xl font-bold text-primary">{selectedCity.metroLines}</div>
                <div className="mt-1 text-sm text-muted-foreground">Metro Lines</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">{selectedCity.metroStations}+</div>
                <div className="mt-1 text-sm text-muted-foreground">Metro Stations</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">{selectedCity.population}</div>
                <div className="mt-1 text-sm text-muted-foreground">Population</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">4</div>
                <div className="mt-1 text-sm text-muted-foreground">Transport Modes</div>
              </div>
            </div>
          </div>
        </section>

        {/* All Cities Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold">Explore All Cities</h2>
              <p className="mt-2 text-muted-foreground">{cities.length} major metro cities across India</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {cities.map((city) => (
                <Card
                  key={city.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedCity.id === city.id ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{city.name}</h3>
                        <p className="text-xs text-muted-foreground">{city.state}</p>
                      </div>
                      {city.hasMetro && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <Train className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{city.tagline}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <span className="rounded bg-muted px-2 py-0.5">{city.metroStations} stations</span>
                      <span className="rounded bg-muted px-2 py-0.5">{city.metroLines} lines</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  )
}
