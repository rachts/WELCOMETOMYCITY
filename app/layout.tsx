import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { CityProvider } from "@/lib/city-context"
import { BottomNav } from "@/components/bottom-nav"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1419" },
  ],
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
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
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
