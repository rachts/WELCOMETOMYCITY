"use client"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2 } from "lucide-react"

interface GeneratePlacesButtonProps {
  cityName: string
  onGenerate: () => Promise<void>
  isGenerating: boolean
}

export function GeneratePlacesButton({ cityName, onGenerate, isGenerating }: GeneratePlacesButtonProps) {
  return (
    <Button onClick={onGenerate} disabled={isGenerating} className="gap-2" size="lg">
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating places for {cityName}...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          Generate {cityName} Attractions with AI
        </>
      )}
    </Button>
  )
}
