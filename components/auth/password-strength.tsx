"use client"

import * as React from "react"
import { Check, X } from "lucide-react"

interface PasswordStrengthProps {
  password?: string
}

export function PasswordStrength({ password = "" }: PasswordStrengthProps) {
  const hasLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)

  const score = [hasLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length

  // Determine color based on score
  let strengthColor = "bg-white/10"
  let strengthText = "text-white/40"
  let label = "Very Weak"

  if (password.length > 0) {
    if (score <= 2) {
      strengthColor = "bg-rose-500"
      strengthText = "text-rose-400"
      label = "Weak"
    } else if (score === 3 || score === 4) {
      strengthColor = "bg-amber-400"
      strengthText = "text-amber-400"
      label = "Medium"
    } else if (score === 5) {
      strengthColor = "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
      strengthText = "text-emerald-400"
      label = "Strong"
    }
  }

  const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center gap-1.5 text-xs transition-colors duration-300 ${met ? "text-emerald-400" : "text-white/40"}`}>
      {met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      <span>{text}</span>
    </div>
  )

  return (
    <div className="w-full flex flex-col gap-2 mt-2 px-1">
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5 flex-1 mr-4">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                password.length > 0 && level <= score ? strengthColor : "bg-white/10"
              }`}
            />
          ))}
        </div>
        <span className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${strengthText}`}>
          {password.length === 0 ? "Strength" : label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-y-1.5 mt-2">
        <RequirementItem met={hasLength} text="8+ Characters" />
        <RequirementItem met={hasUppercase && hasLowercase} text="Upper & lowercase" />
        <RequirementItem met={hasNumber} text="At least 1 number" />
        <RequirementItem met={hasSpecial} text="Special character" />
      </div>
    </div>
  )
}
