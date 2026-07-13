"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles, Navigation, Layers, UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { User } from "@supabase/supabase-js"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

const navItems = [
  { href: "/", label: "OS", icon: Layers },
  { href: "/explore", label: "Explore", icon: Sparkles },
  { href: "/plan", label: "Intelligence", icon: Navigation },
]

export function NavLinks({ user }: { user: User | null }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

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
      
      {/* Auth Section */}
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none ml-2">
            <Avatar className="h-8 w-8 border border-white/10 hover:border-white/30 transition-colors">
              <AvatarImage src={user.user_metadata?.avatar_url || ""} />
              <AvatarFallback className="bg-white/5 text-xs text-white">
                {user.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass-panel border-white/10 bg-black/60 backdrop-blur-xl">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-white">
                  {user.user_metadata?.full_name || "User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem asChild className="focus:bg-white/10 cursor-pointer">
              <Link href="/my-trips" className="w-full flex items-center">
                <Navigation className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem onClick={handleSignOut} className="focus:bg-white/10 cursor-pointer text-red-400 focus:text-red-300">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link
          href="/login"
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-500 ml-1",
            pathname === "/login"
              ? "bg-primary/20 text-primary shadow-[0_0_15px_rgba(0,240,255,0.2)]"
              : "text-muted-foreground hover:bg-white/5 hover:text-white",
          )}
        >
          <UserCircle className={cn("h-3.5 w-3.5", pathname === "/login" ? "text-primary" : "")} />
          Login
        </Link>
      )}
    </nav>
  )
}
