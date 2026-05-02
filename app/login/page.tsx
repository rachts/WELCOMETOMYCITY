import { Navbar } from "@/components/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { login, signup } from "./actions"
import { Sparkles, MapPin } from "lucide-react"
import { Suspense } from "react"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="flex h-screen w-full flex-col bg-[#05070B] relative overflow-hidden">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>

      {/* Background cinematic glow */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="absolute w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse duration-[10s]" />
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <GlassCard glowColor="primary" className="w-full max-w-md p-8 animate-in zoom-in-95 duration-500">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary neon-glow-cyan">
              <MapPin className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Welcome Back</h1>
            <p className="text-sm text-muted-foreground">Sign in to sync your emotional itineraries and saved places.</p>
          </div>

          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/50" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="bg-black/40 border-white/10 h-12 text-white placeholder:text-white/30"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/50" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-black/40 border-white/10 h-12 text-white"
              />
            </div>

            {error && (
              <p className="text-sm text-rose-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20 text-center">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-3 mt-4">
              <Button formAction={login} className="w-full h-12 font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_-5px_rgba(0,240,255,0.4)]">
                <Sparkles className="w-4 h-4 mr-2" /> Sign In
              </Button>
              <Button formAction={signup} variant="outline" className="w-full h-12 font-bold bg-white/5 border-white/10 hover:bg-white/10">
                Create Account
              </Button>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  )
}
