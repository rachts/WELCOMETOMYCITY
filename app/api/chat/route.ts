import { streamText, embed } from 'ai'
import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

export const maxDuration = 30 // Allow up to 30 seconds for the response

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const chatSchema = z.object({
  messages: z.array(z.any()), // ai sdk handles message structure flexibly, but we validate it exists
  cityContext: z.string().optional(),
  userLocation: z.any().optional()
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

    const { messages, cityContext, userLocation } = parseResult.data

    // 1. Get the latest user message for similarity search
    const lastMessage = messages[messages.length - 1]
    const userQuery = lastMessage.content

    // 2. Generate an embedding for the user's query
    const { embedding } = await embed({
      model: openai.embedding('text-embedding-3-small'),
      value: userQuery,
    })

    // 3. Perform similarity search in Supabase
    const { data: matchedPlaces, error } = await supabase.rpc('match_places', {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 5,
    })

    if (error) {
      console.error('Supabase match_places error:', error)
    }

    // 4. Construct context from the matched places
    let contextText = ''
    if (matchedPlaces && matchedPlaces.length > 0) {
      contextText = matchedPlaces
        .map((place: any) => `Place: ${place.name}\nCategory: ${place.category}\nDescription: ${place.long_description || place.short_description}`)
        .join('\n\n')
    }

    // 5. Construct the system prompt with RAG context
    const systemPrompt = `You are an expert local AI Travel Assistant for the city of ${cityContext || 'Kolkata'}. 
Your goal is to provide highly curated, emotionally resonant travel recommendations. 
You specialize in hidden gems, romantic spots, and culturally deep experiences.

Here is the context of relevant places from our database based on the user's query:
${contextText ? contextText : 'No specific places found in our database for this exact query, rely on general knowledge if appropriate, but let the user know.'}

User's current location context (if any): ${userLocation ? JSON.stringify(userLocation) : 'Unknown'}

When users ask for recommendations, suggest specific places from the context above and explain *why* they fit the requested vibe.
Do not just give generic tourist advice; sound like a passionate local who knows the best spots in town.`

    // 6. Stream the response
    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      messages,
    })

    return result.toTextStreamResponse()
  } catch (error: any) {
    console.error('Error in AI Chat route:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
