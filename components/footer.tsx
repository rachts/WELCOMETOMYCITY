"use client"

import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#05070B] py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 neon-glow-cyan">
              <Image src="/logo.png" alt="WelcomeToMyCity Logo" width={32} height={32} className="w-6 h-6 object-contain" />
            </div>
            <span className="font-bold tracking-widest text-sm text-foreground/80">WELCOMETOMYCITY</span>
          </div>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Experience Indian cities by emotion, not just direction. Built with advanced travel intelligence.
          </p>
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground/60">
            <span>© {new Date().getFullYear()} WTMC OS.</span>
            <span>All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
