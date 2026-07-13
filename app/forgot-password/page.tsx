import { AuthLayout } from "@/components/auth/auth-layout"
import { FloatingLabelInput } from "@/components/auth/floating-label-input"
import { Button } from "@/components/ui/button"
import { requestPasswordReset } from "./actions"
import Link from "next/link"
import { ArrowLeft, Send } from "lucide-react"

export const metadata = {
  title: "Forgot Password - WELCOME TO MY CITY",
}

export default async function ForgotPasswordPage({
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
          <Link href="/login" className="inline-flex items-center text-sm font-medium text-white/40 hover:text-white transition-colors mb-4 group">
            <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to login
          </Link>
          <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-sm text-white/50">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400 font-medium animate-in slide-in-from-top-2 fade-in">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 font-medium animate-in slide-in-from-top-2 fade-in flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Send className="w-3 h-3" />
              </div>
              <span className="font-semibold text-emerald-300">Email Sent</span>
            </div>
            {success}
          </div>
        )}

        {!success && (
          <form className="flex flex-col gap-5">
            <FloatingLabelInput
              id="email"
              name="email"
              type="email"
              label="Email address"
              required
              autoComplete="email"
              autoFocus
            />

            <Button 
              formAction={requestPasswordReset} 
              className="w-full h-14 mt-2 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_-5px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_-5px_rgba(0,240,255,0.6)] transition-all group rounded-xl"
            >
              Send Reset Link
              <Send className="w-4 h-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity group-hover:translate-x-1 group-hover:-translate-y-1" /> 
            </Button>
          </form>
        )}
      </div>
    </AuthLayout>
  )
}
