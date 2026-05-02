import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { logout } from "./actions"
import { createClient } from "@/utils/supabase/server"
import { LogOut, MapPin, Heart, Sparkles, Navigation } from "lucide-react"
import { Suspense } from "react"

export default async function MyTripsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch data
  const { data: savedPlaces } = await supabase.from('saved_places').select('*')
  const { data: itineraries } = await supabase.from('itineraries').select('*')

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#05070B] relative">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>

      {/* Cinematic background */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary/10 to-transparent z-0 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[150px] z-0 pointer-events-none" />

      <main className="relative z-10 container mx-auto px-4 pt-28 pb-12 flex-1 flex flex-col">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter mb-2 text-white">My Trips</h1>
            <p className="text-muted-foreground font-medium">Your personalized travel intelligence dashboard.</p>
            <p className="text-xs text-white/40 mt-1">{user.email}</p>
          </div>
          <form action={logout}>
            <Button variant="outline" className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 text-rose-400 hover:text-rose-300">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </form>
        </div>

        {/* Bento Grid Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          
          {/* Stat Card */}
          <GlassCard glowColor="primary" className="p-6 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-5xl font-light tracking-tighter text-white mb-1">{savedPlaces?.length || 0}</h2>
              <p className="font-bold text-white/50 tracking-wide uppercase text-sm">Saved Places</p>
            </div>
          </GlassCard>

          {/* Stat Card */}
          <GlassCard glowColor="secondary" className="p-6 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-5xl font-light tracking-tighter text-white mb-1">{itineraries?.length || 0}</h2>
              <p className="font-bold text-white/50 tracking-wide uppercase text-sm">Saved Itineraries</p>
            </div>
          </GlassCard>

          {/* Emotional Breakdown Card */}
          <GlassCard className="p-6 md:row-span-2 flex flex-col">
            <h3 className="font-bold text-lg mb-6 text-white border-b border-white/10 pb-4">Emotional Memory</h3>
            <div className="flex-1 flex flex-col justify-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
                  <Heart className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold text-white/80">Romantic</span>
                    <span className="text-sm font-bold text-rose-400">
                      {itineraries?.filter(i => i.emotion === 'romantic').length || 0}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-400 rounded-full w-[40%]" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold text-white/80">Hidden Gems</span>
                    <span className="text-sm font-bold text-indigo-400">
                      {itineraries?.filter(i => i.emotion === 'hidden-gems').length || 0}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-400 rounded-full w-[70%]" />
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Recent Places List */}
          <GlassCard className="p-6 overflow-hidden flex flex-col">
            <h3 className="font-bold text-lg mb-4 text-white">Recent Places</h3>
            {savedPlaces && savedPlaces.length > 0 ? (
              <div className="flex-1 overflow-auto pr-2 space-y-3">
                {savedPlaces.slice(0, 5).map((save) => (
                  <div key={save.id} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-medium text-white/90 text-sm truncate max-w-[150px]">{save.place_id.replace(/_/g, ' ')}</span>
                    </div>
                    <span className="text-xs text-white/40">
                      {new Date(save.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-white/30">
                <MapPin className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No places saved yet.</p>
              </div>
            )}
          </GlassCard>

          {/* Saved Itineraries List */}
          <GlassCard className="md:col-span-2 p-6 overflow-hidden flex flex-col">
            <h3 className="font-bold text-lg mb-4 text-white">Saved Itineraries</h3>
            {itineraries && itineraries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 overflow-auto pr-2">
                {itineraries.map((itinerary) => (
                  <div key={itinerary.id} className="flex flex-col p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all cursor-pointer">
                    <h4 className="font-bold text-white mb-1 truncate">{itinerary.name || `${itinerary.days} Day Trip`}</h4>
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <Navigation className="w-3 h-3 text-secondary" />
                        <span className="text-xs text-white/50">{itinerary.city} • {itinerary.days} Days</span>
                      </div>
                      <span className="text-[10px] text-white/30">
                        {new Date(itinerary.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-white/30">
                <Navigation className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No itineraries saved yet.</p>
              </div>
            )}
          </GlassCard>

        </div>
      </main>
    </div>
  )
}
