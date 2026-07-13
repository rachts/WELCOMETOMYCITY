'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { standardRateLimiter } from '@/utils/rate-limit'
import { headers } from 'next/headers'

export async function login(formData: FormData) {
  // 1. Rate Limiting
  const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1'
  const { success } = await standardRateLimiter.limit(`login_${ip}`)
  
  if (!success) {
    return redirect('/login?error=Too many login attempts. Please try again later.')
  }

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const remember = formData.get('remember') === 'on'

  if (!email || !password) {
    return redirect('/login?error=Email and password are required')
  }

  const supabase = await createClient()

  // 2. Authentication
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Improve error message verbosity without leaking if user exists
    console.error("Login error:", error.message)
    if (error.message.includes('Invalid login credentials')) {
      return redirect('/login?error=Invalid email or password')
    }
    if (error.message.includes('Email not confirmed')) {
      return redirect('/login?error=Please verify your email address before logging in')
    }
    return redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/my-trips')
}
