"use client"

import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Info, Code, Database, Map, Rocket, AlertTriangle, Github, Linkedin, Building2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCity } from "@/lib/city-context"

function AboutContent() {
  const { selectedCity, cities } = useCity()

  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">About WELCOMETOMYCITY</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              A civic-tech platform designed to help locals and tourists navigate India's major metro cities
              efficiently.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                  <p className="text-muted-foreground">
                    WELCOMETOMYCITY is a unified web platform that helps locals commute efficiently and tourists explore
                    cities intelligently across {cities.length} major Indian metros. It addresses the fragmentation of
                    transport information across multiple apps and the challenges tourists face in discovering authentic
                    locations and planning routes efficiently.
                  </p>
                  <h4 className="text-foreground font-semibold mt-4">Core Problems Solved</h4>
                  <ul className="text-muted-foreground space-y-2">
                    <li>Transport information fragmented across Metro, Bus, and Cab apps</li>
                    <li>Tourists struggling to discover authentic sightseeing locations</li>
                    <li>No single platform for end-to-end mobility + exploration planning</li>
                    <li>Need to download separate apps for each city</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Supported Cities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Supported Cities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {cities.map((city) => (
                      <div
                        key={city.id}
                        className={`rounded-lg border p-3 ${
                          city.id === selectedCity.id ? "border-primary bg-primary/5" : ""
                        }`}
                      >
                        <div className="font-medium">{city.name}</div>
                        <div className="text-xs text-muted-foreground">{city.state}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {city.metroStations} stations • {city.metroLines} lines
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Map className="h-4 w-4 text-primary" />
                        Transport Planner
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>Multi-modal route comparison</li>
                        <li>Cost and time estimates</li>
                        <li>Interchange information</li>
                        <li>Metro, Bus, Taxi, Walking options</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Map className="h-4 w-4 text-primary" />
                        City Explorer
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>Categorized sightseeing places</li>
                        <li>Detailed place information</li>
                        <li>Nearby transport options</li>
                        <li>Search and filter functionality</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Rocket className="h-4 w-4 text-primary" />
                        Trip Planner
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>1, 2, or 3-day itineraries</li>
                        <li>Route optimization</li>
                        <li>Balanced category coverage</li>
                        <li>Print-friendly format</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Code className="h-4 w-4 text-primary" />
                        Modern Tech Stack
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>Next.js 15 App Router</li>
                        <li>TypeScript for type safety</li>
                        <li>Tailwind CSS + shadcn/ui</li>
                        <li>Responsive & accessible</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Disclaimer */}
              <Card className="border-yellow-500/50 bg-yellow-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                    <AlertTriangle className="h-5 w-5" />
                    Disclaimer
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    This is a demonstration project built for educational purposes. The transport data, routes, and
                    fares shown are static estimates and may not reflect real-time information. Always verify actual
                    schedules and fares from official sources before traveling.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Current City */}
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-base">Currently Viewing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{selectedCity.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedCity.tagline}</div>
                </CardContent>
              </Card>

              {/* Tech Stack */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Tech Stack
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Next.js 15</Badge>
                    <Badge variant="secondary">TypeScript</Badge>
                    <Badge variant="secondary">Tailwind CSS</Badge>
                    <Badge variant="secondary">shadcn/ui</Badge>
                    <Badge variant="secondary">React 19</Badge>
                    <Badge variant="secondary">Vercel</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Future Roadmap */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    Future Roadmap
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Phase 2</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Complete data for all 12 cities</li>
                      <li>• Live maps integration</li>
                      <li>• Real-time data APIs</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Phase 3</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• AI-powered suggestions</li>
                      <li>• User accounts & favorites</li>
                      <li>• Offline mode</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button asChild variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <Link href="/transport">Transport Planner</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <Link href="/explore">Explore {selectedCity.name}</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <Link href="/plan">Trip Planner</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Connect */}
              <Card>
                <CardHeader>
                  <CardTitle>Connect</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button variant="outline" size="icon" className="bg-transparent" asChild>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" className="bg-transparent" asChild>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function AboutPage() {
  return (
    <Suspense fallback={null}>
      <AboutContent />
    </Suspense>
  )
}
