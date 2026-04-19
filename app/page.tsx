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
import { motion } from "framer-motion"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
}
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

function HomeContent() {
  const { selectedCity, cities } = useCity()

  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background pb-20 pt-28 md:pt-36">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
               initial="hidden" 
               animate="visible" 
               variants={stagger} 
               className="mx-auto max-w-3xl text-center"
            >
              <motion.div variants={fadeIn} className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-sm">
                <Building2 className="h-4 w-4" />
                <span>{cities.length} Metro Cities Covered</span>
              </motion.div>
              <motion.h1 variants={fadeIn} className="text-balance text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl drop-shadow-sm">
                <span className="text-primary italic">WELCOME</span>TO
                <br />
                <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  {selectedCity.name.toUpperCase()}
                </span>
              </motion.h1>
              <motion.p variants={fadeIn} className="mx-auto mt-6 text-xl text-muted-foreground/90 font-medium">{selectedCity.tagline}</motion.p>
              <motion.p variants={fadeIn} className="mx-auto mt-3 max-w-2xl text-pretty text-muted-foreground">{selectedCity.description}</motion.p>
              <motion.div variants={fadeIn} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="w-full sm:w-auto gap-2 min-h-[52px] px-8 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-shadow text-base">
                  <Link href="/transport">
                    Plan Route
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto min-h-[52px] px-8 rounded-full bg-background/50 backdrop-blur-sm border-border/80 hover:bg-muted/50 text-base">
                  <Link href="/explore">Explore {selectedCity.name}</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
          <div className="absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-accent/20 blur-[100px] pointer-events-none" />
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
