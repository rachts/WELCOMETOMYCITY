"use client"

import { useState } from "react"
import { AuthLayout } from "@/components/auth/auth-layout"
import { FloatingLabelInput } from "@/components/auth/floating-label-input"
import { PasswordInput } from "@/components/auth/password-input"
import { PasswordStrength } from "@/components/auth/password-strength"
import { SocialLogin } from "@/components/auth/social-login"
import { Button } from "@/components/ui/button"
import { signup } from "./actions"
import Link from "next/link"
import { ArrowLeft, UserPlus } from "lucide-react"

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  // We handle searchParams client-side since this uses "use client" for live password state
  // But strictly speaking, Next.js passes searchParams to page components.
  const error = searchParams?.error
  const [password, setPassword] = useState("")

  return (
    <AuthLayout>
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle top inner glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-sm text-white/50">
              Join us to curate your emotional itineraries.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400 font-medium animate-in slide-in-from-top-2 fade-in">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-5">
          <FloatingLabelInput
            id="name"
            name="name"
            type="text"
            label="Full Name"
            required
            autoComplete="name"
          />

          <FloatingLabelInput
            id="email"
            name="email"
            type="email"
            label="Email address"
            required
            autoComplete="email"
          />

          <div className="flex flex-col gap-1">
            <PasswordInput
              id="password"
              name="password"
              label="Password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordStrength password={password} />
          </div>

          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            required
            autoComplete="new-password"
          />

          <div className="flex items-start mt-2 px-1">
            <label className="flex items-start gap-3 text-sm text-white/60 cursor-pointer group hover:text-white transition-colors">
              <input
                type="checkbox"
                name="terms"
                required
                className="mt-0.5 rounded border-white/20 bg-black/50 text-primary focus:ring-primary/50 cursor-pointer w-4 h-4 transition-all checked:bg-primary"
              />
              <span className="leading-snug">
                I accept the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </span>
            </label>
          </div>

          <Button 
            formAction={signup} 
            className="w-full h-14 mt-4 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_-5px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_-5px_rgba(0,240,255,0.6)] transition-all group rounded-xl"
          >
            <UserPlus className="w-5 h-5 mr-2 opacity-70 group-hover:opacity-100 transition-opacity" /> 
            Create Account
          </Button>

          <SocialLogin />
          
          <div className="mt-6 text-center text-sm text-white/50">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-white hover:text-primary transition-colors inline-flex items-center gap-1 group">
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}
