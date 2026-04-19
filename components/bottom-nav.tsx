"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Train, MapPin, Calendar, Info } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/transport", label: "Transport", icon: Train },
  { href: "/explore", label: "Explore", icon: MapPin },
  { href: "/plan", label: "Plan", icon: Calendar },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-lg border-t border-border pb-[max(env(safe-area-inset-bottom),0.5rem)] px-2 pt-2">
      <div className="flex justify-around items-center h-[52px]">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "fill-primary/20 bg-primary/10 rounded-full p-0.5" : "")} />
              <span className="text-[10px] font-medium tracking-wide">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
