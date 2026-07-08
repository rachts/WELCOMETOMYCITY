import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Fallback in-memory rate limiter for local dev if Upstash is not configured
export class LocalRateLimiter {
  private cache = new Map<string, { count: number; reset: number }>()

  constructor(private limit: number, private windowMs: number) {}

  async limit(identifier: string): Promise<{ success: boolean; remaining: number; reset: number }> {
    const now = Date.now()
    const record = this.cache.get(identifier)

    if (!record || now > record.reset) {
      this.cache.set(identifier, { count: 1, reset: now + this.windowMs })
      return { success: true, remaining: this.limit - 1, reset: now + this.windowMs }
    }

    if (record.count >= this.limit) {
      return { success: false, remaining: 0, reset: record.reset }
    }

    record.count++
    return { success: true, remaining: this.limit - record.count, reset: record.reset }
  }
}

const hasRedis = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN

let redis: Redis | undefined
if (hasRedis) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })
}

// 50 requests per minute per IP for standard API routes
export const standardRateLimiter = hasRedis 
  ? new Ratelimit({ redis: redis!, limiter: Ratelimit.slidingWindow(50, '60 s') }) 
  : new LocalRateLimiter(50, 60000)

// 10 requests per minute per IP for sensitive/LLM routes
export const llmRateLimiter = hasRedis
  ? new Ratelimit({ redis: redis!, limiter: Ratelimit.slidingWindow(10, '60 s') })
  : new LocalRateLimiter(10, 60000)
