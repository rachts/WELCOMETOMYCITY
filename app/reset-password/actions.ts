'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { standardRateLimiter } from '@/utils/rate-limit'
import { headers } from 'next/headers'

export async function resetPassword(formData: FormData) {
  const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1'
  const { success } = await standardRateLimiter.limit(`reset_${ip}`)
  
  if (!success) {
    return redirect('/reset-password?error=Too many requests. Please try again later.')
  }

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || !confirmPassword) {
    return redirect('/reset-password?error=Both fields are required')
  }

  if (password !== confirmPassword) {
    return redirect('/reset-password?error=Passwords do not match')
  }

  if (password.length < 8) {
    return redirect('/reset-password?error=Password must be at least 8 characters')
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    console.error("Reset password error:", error.message)
    return redirect(`/reset-password?error=${encodeURIComponent(error.message)}`)
  }

  return redirect('/login?success=Password updated successfully! You can now log in.')
}
