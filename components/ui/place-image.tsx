"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Landmark, Utensils, TreePine, Waves, Store, MapPin, Tent } from 'lucide-react'

interface PlaceImageProps {
  src?: string | null
  alt: string
  category?: string
  className?: string
}

export function PlaceImage({ src, alt, category = "", className = "" }: PlaceImageProps) {
  const [error, setError] = useState(!src)

  // Map category strings to appropriate Lucide icons
  const getFallbackIcon = () => {
    const cat = category.toLowerCase()
    if (cat.includes('monument') || cat.includes('museum') || cat.includes('fort') || cat.includes('palace') || cat.includes('temple') || cat.includes('church') || cat.includes('mosque') || cat.includes('historic')) {
      return <Landmark className="w-8 h-8 text-white/40" />
    }
    if (cat.includes('food') || cat.includes('restaurant') || cat.includes('cafe') || cat.includes('market')) {
      if (cat.includes('market')) return <Store className="w-8 h-8 text-white/40" />
      return <Utensils className="w-8 h-8 text-white/40" />
    }
    if (cat.includes('park') || cat.includes('garden') || cat.includes('nature') || cat.includes('zoo')) {
      return <TreePine className="w-8 h-8 text-white/40" />
    }
    if (cat.includes('beach') || cat.includes('lake') || cat.includes('water') || cat.includes('sea')) {
      return <Waves className="w-8 h-8 text-white/40" />
    }
    return <MapPin className="w-8 h-8 text-white/40" />
  }

  if (error || !src || src.trim() === '') {
    return (
      <div className={`flex items-center justify-center bg-black/40 border border-white/5 ${className}`}>
        {getFallbackIcon()}
      </div>
    )
  }

  // Next.js Image component needs to know if the image is external to apply optimizations (or unoptimized)
  // We're using unoptimized in next.config.js, so this is safe for any URL.
  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      className={className}
      onError={() => setError(true)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}
