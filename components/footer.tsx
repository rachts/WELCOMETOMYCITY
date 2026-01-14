"use client"

import Link from "next/link"
import { Train } from "lucide-react"
import { useCity } from "@/lib/city-context"

export function Footer() {
  const { selectedCity } = useCity()

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Train className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">WELCOMETOMYCITY</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Navigate {selectedCity.name} with ease - Your unified mobility & tourism platform
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/transport" className="hover:text-foreground transition-colors">
              Transport
            </Link>
            <Link href="/explore" className="hover:text-foreground transition-colors">
              Explore
            </Link>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            Made by <span className="font-medium text-foreground">Rachit</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
