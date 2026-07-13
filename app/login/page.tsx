import { AuthLayout } from "@/components/auth/auth-layout"
import { FloatingLabelInput } from "@/components/auth/floating-label-input"
import { PasswordInput } from "@/components/auth/password-input"
import { SocialLogin } from "@/components/auth/social-login"
import { Button } from "@/components/ui/button"
import { login } from "./actions"
import Link from "next/link"
import { Sparkles, ArrowRight } from "lucide-react"

export const metadata = {
  title: "Login - WELCOME TO MY CITY",
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const { error, success } = await searchParams

  return (
    <AuthLayout>
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle top inner glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
          <p className="text-sm text-white/50">
            Welcome back! Please enter your details.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400 font-medium animate-in slide-in-from-top-2 fade-in">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 font-medium animate-in slide-in-from-top-2 fade-in">
            {success}
          </div>
        )}

        <form className="flex flex-col gap-5">
          <FloatingLabelInput
            id="email"
            name="email"
            type="email"
            label="Email address"
            required
            autoComplete="email"
          />

          <div className="flex flex-col gap-2">
            <PasswordInput
              id="password"
              name="password"
              label="Password"
              required
              autoComplete="current-password"
            />
            
            <div className="flex items-center justify-between mt-1 px-1">
              <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer group hover:text-white transition-colors">
                <input
                  type="checkbox"
                  name="remember"
                  className="rounded border-white/20 bg-black/50 text-primary focus:ring-primary/50 cursor-pointer w-4 h-4 transition-all checked:bg-primary"
                />
                Remember me
              </label>
              
              <Link 
                href="/forgot-password" 
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button 
            formAction={login} 
            className="w-full h-14 mt-2 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_-5px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_-5px_rgba(0,240,255,0.6)] transition-all group rounded-xl"
          >
            <Sparkles className="w-5 h-5 mr-2 opacity-70 group-hover:opacity-100 transition-opacity" /> 
            Sign In
          </Button>

          <SocialLogin />
          
          <div className="mt-6 text-center text-sm text-white/50">
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold text-white hover:text-primary transition-colors inline-flex items-center gap-1 group">
              Create one now
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}
