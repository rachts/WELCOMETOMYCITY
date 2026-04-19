"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

interface ModeCardProps {
  href: string
  icon: LucideIcon
  title: string
  description: string
  gradient: string
}

export function ModeCard({ href, icon: Icon, title, description, gradient }: ModeCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="h-full"
      >
        <Card className="h-full overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)]">
          <CardContent className="p-0 h-full flex flex-col">
            <div className={cn("flex h-32 items-center justify-center relative overflow-hidden", gradient)}>
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <Icon className="h-12 w-12 text-foreground transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-lg z-10" />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-center">
              <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
}
