import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { llmRateLimiter, standardRateLimiter } from '@/utils/rate-limit'

export async function updateSession(request: NextRequest) {
  // 1. Rate Limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? '127.0.0.1'
    const isLlmRoute = request.nextUrl.pathname.startsWith('/api/chat') || 
                       request.nextUrl.pathname.startsWith('/api/generate-places') || 
                       request.nextUrl.pathname.startsWith('/api/admin/ingest-places')
    
    const limiter = isLlmRoute ? llmRateLimiter : standardRateLimiter
    const rateLimitResult = await limiter.limit(ip)
    
    if (!rateLimitResult.success) {
      return new NextResponse(JSON.stringify({ error: 'Too Many Requests' }), { 
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://*.googleusercontent.com https://*.supabase.co https://images.unsplash.com https://*.cartocdn.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' blob: https://*.supabase.co https://*.googleapis.com https://*.cartocdn.com https://vercel.live;
    worker-src 'self' blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('Content-Security-Policy', cspHeader)

  let supabaseResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  supabaseResponse.headers.set('Content-Security-Policy', cspHeader)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              secure: process.env.NODE_ENV === 'production',
              httpOnly: true,
              sameSite: 'lax',
            })
          )
        },
      },
    }
  )

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Admin Route Protection
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }

  // Protect /my-trips route
  if (!user && request.nextUrl.pathname.startsWith('/my-trips')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect to dashboard if logged in and trying to hit /login
  if (user && request.nextUrl.pathname.startsWith('/login')) {
    const url = request.nextUrl.clone()
    url.pathname = '/my-trips'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
