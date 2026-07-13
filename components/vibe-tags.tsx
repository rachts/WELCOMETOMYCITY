"use client"

import { useState, useEffect } from "react"
import { getVibeVotes } from "@/lib/api/vibes"
import { voteVibe } from "@/app/explore/actions"
import { ArrowUp, ArrowDown } from "lucide-react"

interface VibeTagsProps {
  currentVibes: string[]
  placeId: string
  themeClass?: string
}

type VibeVote = {
  vibe_tag: string
  upvotes: number
  downvotes: number
}

export function VibeTags({ currentVibes, placeId, themeClass = "text-primary" }: VibeTagsProps) {
  const [votes, setVotes] = useState<VibeVote[]>([])
  const [localVotes, setLocalVotes] = useState<Record<string, 'upvote' | 'downvote'>>({})

  useEffect(() => {
    async function loadVotes() {
      const dbVotes = await getVibeVotes(placeId)
      setVotes(dbVotes)
    }
    loadVotes()
  }, [placeId])

  const handleVote = async (tag: string, type: 'upvote' | 'downvote') => {
    // Optimistic update
    setLocalVotes(prev => ({ ...prev, [tag]: type }))
    setVotes(prev => {
      const existing = prev.find(v => v.vibe_tag === tag)
      if (existing) {
        return prev.map(v => 
          v.vibe_tag === tag 
            ? { ...v, upvotes: type === 'upvote' ? v.upvotes + 1 : v.upvotes, downvotes: type === 'downvote' ? v.downvotes + 1 : v.downvotes }
            : v
        )
      } else {
        return [...prev, {
          vibe_tag: tag,
          upvotes: type === 'upvote' ? 1 : 0,
          downvotes: type === 'downvote' ? 1 : 0
        }]
      }
    })
    
    // Server mutation
    await voteVibe(placeId, tag, type)
  }

  // Merge current vibes with db votes and sort by consensus
  const sortedVibes = [...currentVibes].sort((a, b) => {
    const voteA = votes.find(v => v.vibe_tag === a)
    const voteB = votes.find(v => v.vibe_tag === b)
    
    const scoreA = voteA ? (voteA.upvotes - voteA.downvotes) : 0
    const scoreB = voteB ? (voteB.upvotes - voteB.downvotes) : 0
    
    return scoreB - scoreA
  })

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {sortedVibes.map((tag, index) => {
        const voteData = votes.find(v => v.vibe_tag === tag)
        const netScore = voteData ? (voteData.upvotes - voteData.downvotes) : 0
        const hasVoted = localVotes[tag]

        return (
          <div key={`${tag}-${index}`} className="flex items-center bg-black/40 border border-white/10 rounded-full px-2 py-1 gap-1">
            <span className="text-xs font-medium text-white/80 pl-1 capitalize">{tag}</span>
            <div className="flex items-center gap-1 border-l border-white/10 pl-2 ml-1">
              <button 
                onClick={() => handleVote(tag, 'upvote')}
                disabled={!!hasVoted}
                className={`hover:bg-white/10 rounded-full p-0.5 transition-colors ${hasVoted === 'upvote' ? themeClass : 'text-white/40'}`}
              >
                <ArrowUp className="w-3 h-3" />
              </button>
              <span className={`text-[10px] font-bold ${netScore > 0 ? themeClass : netScore < 0 ? 'text-red-400' : 'text-white/40'}`}>
                {netScore > 0 ? `+${netScore}` : netScore}
              </span>
              <button 
                onClick={() => handleVote(tag, 'downvote')}
                disabled={!!hasVoted}
                className={`hover:bg-white/10 rounded-full p-0.5 transition-colors ${hasVoted === 'downvote' ? 'text-red-400' : 'text-white/40'}`}
              >
                <ArrowDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
