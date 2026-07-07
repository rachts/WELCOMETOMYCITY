"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import type { Collection } from "@/lib/types"

interface BentoGridProps {
  collections: Collection[]
  onSelectCollection: (collection: Collection) => void
}

export function BentoGrid({ collections, onSelectCollection }: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-[150px]">
      {collections.map((collection, index) => {
        // Make the first item take up more space to create a nice bento effect
        const isFeatured = index === 0
        return (
          <motion.div
            key={collection.id}
            layoutId={`collection-${collection.id}`}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCollection(collection)}
            className={`cursor-pointer relative overflow-hidden rounded-2xl border border-white/10 group ${
              isFeatured ? "md:col-span-2 row-span-2" : ""
            }`}
          >
            <div className="absolute inset-0 bg-black/40 z-10 transition-colors group-hover:bg-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/50 to-transparent z-10" />
            
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={collection.coverImage} 
              alt={collection.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            <div className="absolute bottom-0 left-0 right-0 p-5 z-20 flex flex-col justify-end">
              <h3 className={`font-bold text-white mb-1 ${isFeatured ? "text-2xl" : "text-lg"}`}>
                {collection.title}
              </h3>
              <p className="text-white/70 text-sm line-clamp-2">
                {collection.description}
              </p>
              
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs font-medium px-2 py-1 bg-white/10 backdrop-blur-md rounded-md border border-white/10">
                  {collection.places.length} places
                </span>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
