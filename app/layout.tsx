import type React from "react"
import type { Metadata, Viewport } from "next"
import { Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { CityProvider } from "@/lib/city-context"
import { BottomNav } from "@/components/bottom-nav"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "WELCOMETOMYCITY - Navigate India's Metro Cities",
  description:
    "Your unified platform to navigate India's major metro cities. Plan transport routes, explore landmarks, and create trip itineraries for Delhi, Mumbai, Kolkata, Chennai, Bangalore, and more.",
  keywords: [
    "India",
    "metro",
    "transport",
    "tourism",
    "city guide",
    "route planner",
    "Delhi",
    "Mumbai",
    "Kolkata",
    "Chennai",
    "Bangalore",
    "Hyderabad",
  ],
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#05070B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${spaceGrotesk.className} antialiased pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0`}>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
          <CityProvider>
            {children}
            <BottomNav />
          </CityProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
