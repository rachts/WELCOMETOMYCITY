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
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 group-hover:neon-glow-cyan transition-all duration-300">
            <Image src="/logo.png" alt="WelcomeToMyCity Logo" width={32} height={32} className="w-6 h-6 object-contain" />
          </div>
          <span className="font-bold text-sm tracking-widest hidden sm:inline-block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            WTMC
          </span>
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
