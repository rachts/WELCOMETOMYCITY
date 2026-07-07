import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const type = searchParams.get('type') || 'tourist_attraction'
  const radius = searchParams.get('radius') || '5000'

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing lat or lng parameters' }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'Google Maps API key is not configured on the server' }, { status: 500 })
  }

  try {
    const googleUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`
    
    const response = await fetch(googleUrl)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error_message || 'Failed to fetch from Google Maps API')
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching places from Google Maps:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
