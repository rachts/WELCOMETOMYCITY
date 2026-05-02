import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { PlanClient } from "./plan-client"
import { getPlacesByCity } from "@/lib/api/places"

export default async function PlanPage() {
  const places = await getPlacesByCity('kolkata')

  return (
    <>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <Suspense fallback={null}>
        <PlanClient initialPlaces={places} />
      </Suspense>
    </>
  )
}
