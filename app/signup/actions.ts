'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { standardRateLimiter } from '@/utils/rate-limit'
import { headers } from 'next/headers'

export async function signup(formData: FormData) {
  const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1'
  const { success } = await standardRateLimiter.limit(`signup_${ip}`)
  
  if (!success) {
    return redirect('/signup?error=Too many attempts. Please try again later.')
  }

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const terms = formData.get('terms') === 'on'

  if (!email || !password || !name) {
    return redirect('/signup?error=All fields are required')
  }

  if (password !== confirmPassword) {
    return redirect('/signup?error=Passwords do not match')
  }

  if (password.length < 8) {
    return redirect('/signup?error=Password must be at least 8 characters')
  }

  if (!terms) {
    return redirect('/signup?error=You must accept the terms to continue')
  }

  const supabase = await createClient()

  // Extract first name from full name
  const firstName = name.split(' ')[0]

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        first_name: firstName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    }
  })

  if (error) {
    console.error("Signup error:", error.message)
    if (error.message.includes('already registered')) {
      return redirect('/signup?error=An account with this email already exists')
    }
    return redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  // Redirect to success or my-trips directly (if email confirmation is turned off)
  redirect('/login?success=Account created successfully! Please log in.')
}
