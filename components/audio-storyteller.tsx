"use client"

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Square } from 'lucide-react'

interface AudioStorytellerProps {
  placeId: string
  text: string
  themeClass?: string
}

export function AudioStoryteller({ placeId, text, themeClass = "text-primary" }: AudioStorytellerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  // Clean up native speech synthesis on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  const handleTogglePlay = async () => {
    if (isPlaying) {
      stopAudio()
    } else {
      await playAudio()
    }
  }

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    window.speechSynthesis.cancel()
    setIsPlaying(false)
  }

  const playNativeFallback = () => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.onend = () => setIsPlaying(false)
    window.speechSynthesis.speak(utterance)
    setIsPlaying(true)
    setIsLoading(false)
  }

  const playAudio = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (response.status === 501) {
        // Fallback to browser native TTS if ElevenLabs key is missing
        console.warn("ElevenLabs not configured, falling back to native SpeechSynthesis")
        playNativeFallback()
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch audio stream')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      
      if (!audioRef.current) {
        audioRef.current = new Audio()
        audioRef.current.onended = () => setIsPlaying(false)
      }
      
      audioRef.current.src = url
      await audioRef.current.play()
      setIsPlaying(true)
      
    } catch (err: any) {
      console.error(err)
      setError("Failed to play audio")
      // Final fallback
      playNativeFallback()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleTogglePlay}
        disabled={isLoading}
        className={`flex items-center justify-center w-10 h-10 rounded-full bg-black/40 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md ${themeClass}`}
        aria-label={isPlaying ? "Stop Story" : "Play Story"}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <Square className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
      </motion.button>
      
      {error && <span className="text-xs text-rose-400">{error}</span>}
      {!error && (
        <span className="text-xs text-white/50 font-medium">
          {isPlaying ? "Playing Story..." : "Listen to Story"}
        </span>
      )}
    </div>
  )
}
