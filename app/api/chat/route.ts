import { streamText } from 'ai'
import { google } from '@ai-sdk/google'

export const maxDuration = 30 // Allow up to 30 seconds for the response

export async function POST(req: Request) {
  try {
    const { messages, cityContext } = await req.json()

    const systemPrompt = `You are an expert local AI Travel Assistant for the city of ${cityContext || 'Kolkata'}. 
Your goal is to provide highly curated, emotionally resonant travel recommendations. 
You specialize in hidden gems, romantic spots, and culturally deep experiences.
When users ask for recommendations, suggest specific places and explain *why* they fit the requested vibe.
Do not just give generic tourist advice; sound like a passionate local who knows the best spots in town.`

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      messages,
    })

    return result.toDataStreamResponse()
  } catch (error: any) {
    console.error('Error in AI Chat route:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
