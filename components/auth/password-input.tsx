"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label = "Password", error, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-')

    const togglePasswordVisibility = () => setShowPassword(!showPassword)

    return (
      <div className="relative group w-full">
        <input
          type={showPassword ? "text" : "password"}
          id={inputId}
          className={cn(
            "peer w-full h-14 px-4 pt-4 pb-1 pr-12 bg-black/40 border border-white/10 rounded-xl",
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
        
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-4 text-white/40 hover:text-white/80 transition-colors focus:outline-none focus:text-primary"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5 animate-in zoom-in duration-200" />
          ) : (
            <Eye className="w-5 h-5 animate-in zoom-in duration-200" />
          )}
        </button>

        {error && (
          <p className="mt-1.5 text-xs text-rose-400 font-medium px-1 animate-in slide-in-from-top-1 fade-in">
            {error}
          </p>
        )}
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
