import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const photo_reference = searchParams.get('photo_reference')
  const maxwidth = searchParams.get('maxwidth') || '800'

  if (!photo_reference) {
    return NextResponse.json({ error: 'Missing photo_reference parameter' }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'Google Maps API key is not configured on the server' }, { status: 500 })
  }

  try {
    const googleUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photo_reference=${photo_reference}&key=${apiKey}`
    
    // We use redirect: 'manual' to catch the 302 redirect from Google.
    // Google returns a keyless lh3.googleusercontent.com URL in the location header.
    // By redirecting the client to *that* URL, we avoid exposing our API key.
    const response = await fetch(googleUrl, { redirect: 'manual' })

    if (response.status === 302 || response.status === 301) {
      const location = response.headers.get('location')
      if (location) {
        return NextResponse.redirect(location)
      }
    }

    // If it didn't redirect, maybe it failed or returned the image directly
    if (!response.ok) {
      throw new Error('Failed to fetch photo from Google Maps API')
    }

    // Fallback if it returns the image buffer directly
    const buffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (error: any) {
    console.error('Error fetching photo from Google Maps:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
