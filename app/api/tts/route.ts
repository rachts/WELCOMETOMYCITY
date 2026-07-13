import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      // Return 501 to trigger the client-side native TTS fallback
      return new NextResponse(null, { status: 501 })
    }

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: 'alloy', // options: alloy, echo, fable, onyx, nova, shimmer
        response_format: 'mp3',
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI TTS Error:', errorText)
      return NextResponse.json({ error: 'Failed to generate speech' }, { status: response.status })
    }

    const audioBuffer = await response.arrayBuffer()

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('TTS API Route Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
