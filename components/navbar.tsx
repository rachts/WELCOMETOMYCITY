"use client"

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { CitySwitcher } from "@/components/city-switcher"
import { Sparkles, Navigation, Layers, UserCircle } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { NavLinks } from "./nav-links"
import type { User } from "@supabase/supabase-js"

const navItems = [
  { href: "/", label: "OS", icon: Layers },
  { href: "/explore", label: "Explore", icon: Sparkles },
  { href: "/plan", label: "Intelligence", icon: Navigation },
]

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })
    
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <header className="pointer-events-auto flex items-center gap-2 p-2 rounded-full glass-panel border-white/10 shadow-2xl">
        
        <Link href="/" className="flex items-center gap-2 pl-3 pr-2 py-1 group">
          <Image 
            src="/logo.png" 
            alt="Welcome to My City" 
            width={120} 
            height={40} 
            className="h-8 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300" 
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <NavLinks user={user} />

        <div className="border-l border-white/10 pl-2">
          <CitySwitcher />
        </div>
      </header>
    </div>
  )
}
