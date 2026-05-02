"use client"

import { Suspense } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Sparkles, Navigation, Heart, BookOpen, Utensils, MapPin, Cloud, Zap, ArrowRight, Activity, Users } from "lucide-react"

const MODES = [
  { id: "romantic", label: "Romantic Evenings", icon: Heart, color: "text-rose-400", glow: "hover:neon-glow-violet", border: "hover:border-rose-400/50" },
  { id: "hidden-gems", label: "Hidden Gems", icon: Sparkles, color: "text-indigo-400", glow: "hover:neon-glow-cyan", border: "hover:border-indigo-400/50" },
  { id: "cultural", label: "Cultural Trails", icon: BookOpen, color: "text-amber-400", glow: "hover:shadow-[0_0_20px_-5px_rgba(251,191,36,0.4)]", border: "hover:border-amber-400/50" },
  { id: "food", label: "Food Crawls", icon: Utensils, color: "text-orange-400", glow: "hover:shadow-[0_0_20px_-5px_rgba(249,115,22,0.4)]", border: "hover:border-orange-400/50" },
  { id: "peaceful", label: "Peaceful Escapes", icon: Cloud, color: "text-teal-400", glow: "hover:neon-glow-cyan", border: "hover:border-teal-400/50" }
]

function LandingContent() {
  return (
    <div className="flex min-h-screen flex-col selection:bg-primary/30">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>

      <main className="flex-1 relative">
        {/* 1. Cinematic Hero Section */}
        <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden">
          {/* Deep space radial gradients to simulate the cinematic map/city glow */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-50 mix-blend-screen animate-pulse duration-[10s]" />
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[150px] opacity-50 mix-blend-screen animate-pulse duration-[15s]" />
          </div>

          {/* Abstract glowing nodes/lines simulating routes */}
          <div className="absolute inset-0 z-0 opacity-30">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <path d="M-100,500 Q200,300 500,600 T1200,400" fill="none" stroke="url(#cyan-glow)" strokeWidth="1" className="animate-[dash_20s_linear_infinite]" strokeDasharray="10 20" />
              <path d="M200,800 Q400,200 800,400 T1400,700" fill="none" stroke="url(#violet-glow)" strokeWidth="2" className="animate-[dash_30s_linear_infinite]" strokeDasharray="5 15" />
              <defs>
                <linearGradient id="cyan-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0" />
                  <stop offset="50%" stopColor="#00f0ff" stopOpacity="1" />
                  <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="violet-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="container relative z-10 mx-auto px-4 text-center flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="glass-panel px-6 py-2 rounded-full mb-8 inline-flex items-center gap-2 border-primary/30 neon-glow-cyan"
            >
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold tracking-widest uppercase text-primary">WTMC Travel OS v2.0</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter max-w-5xl mb-6 leading-[1.1]"
            >
              Experience Cities By <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Emotion</span>, Not Just Direction.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 font-medium"
            >
              AI-powered urban exploration for India's most vibrant cities. A premium intelligence platform designed for the modern traveler.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-base font-bold shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,240,255,0.5)]">
                <Link href="/explore">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Explore Cities
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 h-14 px-8 text-base font-bold transition-all duration-300">
                <Link href="/plan">
                  <Navigation className="mr-2 h-5 w-5" />
                  Plan Your Journey
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Fade out bottom to next section */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#05070B] to-transparent z-10" />
        </section>

        {/* 2. Interactive Mode Selector */}
        <section className="relative py-24 z-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Select Your Vibe</h2>
              <p className="text-muted-foreground text-center max-w-xl">
                Choose an emotional overlay. Watch the city morph to reveal exactly what you're feeling.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {MODES.map((mode, i) => {
                const Icon = mode.icon
                return (
                  <motion.div
                    key={mode.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Link href={`/explore?mode=${mode.id}`}>
                      <div className={`glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-4 h-48 cursor-pointer group ${mode.glow} ${mode.border}`}>
                        <div className={`p-4 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors ${mode.color}`}>
                          <Icon className="w-8 h-8" />
                        </div>
                        <span className="font-bold text-sm md:text-base tracking-wide text-foreground/90 group-hover:text-white transition-colors">
                          {mode.label}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* 3. Live City Intelligence Dashboard (Bento Grid) */}
        <section className="relative py-24 z-20 bg-white/[0.02] border-y border-white/5">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Live Intelligence</h2>
                <p className="text-muted-foreground max-w-xl">
                  Real-time urban telemetry powering your emotional itinerary.
                </p>
              </div>
              <Button variant="ghost" className="rounded-full text-primary hover:bg-primary/10 hover:text-primary hidden md:flex items-center group">
                View Telemetry <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px]">
              {/* Large Map Card */}
              <div className="glass-card rounded-3xl md:col-span-2 md:row-span-2 overflow-hidden relative group">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558486012-817176f84c6d?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity group-hover:opacity-60 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 mb-2 text-primary neon-glow-cyan w-fit px-3 py-1 rounded-full bg-primary/10 backdrop-blur-md">
                    <Activity className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Live Route Telemetry</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">Victoria Memorial Route</h3>
                  <p className="text-muted-foreground text-sm">Traffic density low. Optimal time to visit.</p>
                </div>
              </div>

              {/* Weather/Atmosphere */}
              <div className="glass-card rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2" />
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-xl bg-white/10">
                    <Cloud className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">KOLKATA</span>
                </div>
                <div>
                  <h4 className="text-4xl font-light tracking-tighter mb-1">28°</h4>
                  <p className="text-sm text-amber-400/80 font-medium">Golden Hour approaching</p>
                </div>
              </div>

              {/* Crowd Density */}
              <div className="glass-card rounded-3xl p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-xl bg-white/10">
                    <Users className="w-5 h-5 text-rose-400" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1">Park Street</h4>
                  <p className="text-sm text-rose-400/80 font-medium">High social density</p>
                  <div className="h-1.5 w-full bg-white/10 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-rose-400 w-[85%] rounded-full shadow-[0_0_10px_rgba(251,113,133,0.5)]" />
                  </div>
                </div>
              </div>

              {/* Hidden Gem of the Day */}
              <div className="glass-card rounded-3xl md:col-span-2 p-6 flex items-center justify-between group cursor-pointer hover:border-primary/30 hover:neon-glow-cyan transition-all duration-500">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Hidden Gem Match</span>
                  </div>
                  <h4 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">Kumartuli Studio Walk</h4>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    A highly authentic offbeat experience scoring 95% on our Cultural Deep Dive metrics.
                  </p>
                </div>
                <div className="hidden sm:flex w-12 h-12 rounded-full border border-white/20 items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-all duration-500">
                  <ArrowRight className="w-5 h-5 group-hover:-rotate-45 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <LandingContent />
    </Suspense>
  )
}
