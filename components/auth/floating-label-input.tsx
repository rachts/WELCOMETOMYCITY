"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface FloatingLabelInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ className, label, error, type, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="relative group w-full">
        <input
          type={type}
          id={inputId}
          className={cn(
            "peer w-full h-14 px-4 pt-4 pb-1 bg-black/40 border border-white/10 rounded-xl",
            "text-white placeholder:text-transparent transition-all duration-300",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:bg-black/60",
            "hover:border-white/20",
            error && "border-rose-500/50 focus:ring-rose-500/50 focus:border-rose-500/50",
            className
          )}
          placeholder={label}
          ref={ref}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "absolute left-4 top-4 text-sm text-white/50 transition-all duration-300 pointer-events-none",
            "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-white/50",
            "peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-primary",
            "peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:text-white/70",
            error && "peer-focus:text-rose-400 peer-[:not(:placeholder-shown)]:text-rose-400"
          )}
        >
          {label}
        </label>
        {error && (
          <p className="mt-1.5 text-xs text-rose-400 font-medium px-1 animate-in slide-in-from-top-1 fade-in">
            {error}
          </p>
        )}
      </div>
    )
  }
)
FloatingLabelInput.displayName = "FloatingLabelInput"

export { FloatingLabelInput }
