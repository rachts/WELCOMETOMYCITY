"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles, Navigation, Layers, UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { User } from "@supabase/supabase-js"

const navItems = [
  { href: "/", label: "OS", icon: Layers },
  { href: "/explore", label: "Explore", icon: Sparkles },
  { href: "/plan", label: "Intelligence", icon: Navigation },
]

export function NavLinks({ user }: { user: User | null }) {
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-1 px-2 border-l border-white/10">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-500",
              isActive
                ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                : "text-muted-foreground hover:bg-white/5 hover:text-white",
            )}
          >
            <Icon className={cn("h-3.5 w-3.5", isActive ? "text-primary" : "")} />
            {item.label}
          </Link>
        )
      })}
      
      {/* Auth Link */}
      <Link
        href={user ? "/my-trips" : "/login"}
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-500",
          pathname === "/my-trips" || pathname === "/login"
            ? "bg-primary/20 text-primary shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            : "text-muted-foreground hover:bg-white/5 hover:text-white",
        )}
      >
        <UserCircle className={cn("h-3.5 w-3.5", (pathname === "/my-trips" || pathname === "/login") ? "text-primary" : "")} />
        {user ? "Dashboard" : "Login"}
      </Link>
    </nav>
  )
}
