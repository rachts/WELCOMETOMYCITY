'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { standardRateLimiter } from '@/utils/rate-limit'
import { headers } from 'next/headers'

export async function requestPasswordReset(formData: FormData) {
  const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1'
  const { success } = await standardRateLimiter.limit(`forgot_${ip}`)
  
  if (!success) {
    return redirect('/forgot-password?error=Too many requests. Please try again later.')
  }

  const email = formData.get('email') as string

  if (!email) {
    return redirect('/forgot-password?error=Email is required')
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
  })

  if (error) {
    console.error("Forgot password error:", error.message)
    // To prevent email enumeration, usually we still say "If an account exists, an email was sent"
    // But Supabase typically handles this. For now we will show success to prevent enumeration.
  }

  return redirect('/forgot-password?success=If an account exists, a password reset link has been sent to your email.')
}
