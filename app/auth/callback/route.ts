import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  // URL to redirect to after sign in process completes
  const next = requestUrl.searchParams.get('next') ?? '/my-trips'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Successful authentication
      // Redirect to the originally requested page or default
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }
  }

  // Error case or missing code
  // redirect the user to an error page with some instructions
  return NextResponse.redirect(new URL('/login?error=Authentication failed. Please try again.', requestUrl.origin))
}
