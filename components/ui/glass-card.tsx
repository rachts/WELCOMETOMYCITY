import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: "primary" | "secondary" | "accent" | "rose" | "indigo" | "none"
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, glowColor = "none", ...props }, ref) => {
    
    const glowClasses = {
      primary: "hover:shadow-[0_0_20px_-5px_rgba(0,240,255,0.4)] hover:border-primary/50",
      secondary: "hover:shadow-[0_0_20px_-5px_rgba(139,92,246,0.4)] hover:border-secondary/50",
      accent: "hover:shadow-[0_0_20px_-5px_rgba(217,70,239,0.4)] hover:border-accent/50",
      rose: "hover:shadow-[0_0_20px_-5px_rgba(244,63,94,0.4)] hover:border-rose-400/50",
      indigo: "hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)] hover:border-indigo-400/50",
      none: "hover:border-white/20"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl transition-all duration-500",
          glowClasses[glowColor],
          className
        )}
        {...props}
      />
    )
  }
)
GlassCard.displayName = "GlassCard"

export { GlassCard }
