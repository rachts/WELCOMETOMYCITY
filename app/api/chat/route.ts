import { streamText } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'

export const maxDuration = 30 // Allow up to 30 seconds for the response

const chatSchema = z.object({
  messages: z.array(z.any()), // ai sdk handles message structure flexibly, but we validate it exists
  cityContext: z.string().optional()
})

export async function POST(req: Request) {
  try {
    let body
    try {
      body = await req.json()
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
    }

    const parseResult = chatSchema.safeParse(body)
    if (!parseResult.success) {
      return new Response(JSON.stringify({ error: 'Invalid request payload' }), { status: 400 })
    }

    const { messages, cityContext } = parseResult.data

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
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
