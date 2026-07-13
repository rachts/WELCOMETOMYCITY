import { ReactNode } from "react"
import { Navbar } from "@/components/navbar"
import { MapPin } from "lucide-react"

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#05070B] relative overflow-hidden font-sans">
      <Navbar />

      {/* Cinematic animated background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse duration-[10s] mix-blend-screen" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse duration-[8s] delay-1000 mix-blend-screen" />
        
        {/* Subtle noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Brand Header */}
          <div className="flex flex-col items-center mb-8 text-center animate-in slide-in-from-bottom-4 fade-in duration-700">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <div className="relative w-14 h-14 bg-black/50 border border-white/10 rounded-2xl flex items-center justify-center text-primary backdrop-blur-xl shadow-[0_0_15px_-3px_rgba(0,240,255,0.3)]">
                <MapPin className="w-7 h-7 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white/90 drop-shadow-sm mb-2">
              WELCOME TO MY CITY
            </h1>
            <p className="text-sm font-medium text-white/50 tracking-wide">
              Discover places that match your mood.
            </p>
          </div>

          {/* Form Content */}
          <div className="animate-in slide-in-from-bottom-8 fade-in duration-700 delay-150 fill-mode-both">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
