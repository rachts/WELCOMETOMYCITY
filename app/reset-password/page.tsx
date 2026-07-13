"use client"

import { useState } from "react"
import { AuthLayout } from "@/components/auth/auth-layout"
import { PasswordInput } from "@/components/auth/password-input"
import { PasswordStrength } from "@/components/auth/password-strength"
import { Button } from "@/components/ui/button"
import { resetPassword } from "./actions"
import { LockKeyhole } from "lucide-react"

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const error = searchParams?.error
  const [password, setPassword] = useState("")

  return (
    <AuthLayout>
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle top inner glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Set New Password</h2>
          <p className="text-sm text-white/50">
            Please enter your new password below.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400 font-medium animate-in slide-in-from-top-2 fade-in">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <PasswordInput
              id="password"
              name="password"
              label="New Password"
              required
              autoComplete="new-password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordStrength password={password} />
          </div>

          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm New Password"
            required
            autoComplete="new-password"
          />

          <Button 
            formAction={resetPassword} 
            className="w-full h-14 mt-4 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_-5px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_-5px_rgba(0,240,255,0.6)] transition-all group rounded-xl"
          >
            <LockKeyhole className="w-5 h-5 mr-2 opacity-70 group-hover:opacity-100 transition-opacity" /> 
            Update Password
          </Button>
        </form>
      </div>
    </AuthLayout>
  )
}
