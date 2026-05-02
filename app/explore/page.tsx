import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { ExploreClient } from "./explore-client"
import { getPlacesByCity } from "@/lib/api/places"

export default async function ExplorePage() {
  // Fetch places from Supabase Server Component
  const places = await getPlacesByCity('kolkata')

  return (
    <>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <Suspense fallback={null}>
        <ExploreClient initialPlaces={places} />
      </Suspense>
    </>
  )
}
