"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface ModeCardProps {
  href: string
  icon: LucideIcon
  title: string
  description: string
  gradient: string
}

export function ModeCard({ href, icon: Icon, title, description, gradient }: ModeCardProps) {
  return (
    <Link href={href} className="group">
      <Card className="h-full overflow-hidden border-border/50 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
        <CardContent className="p-0">
          <div className={cn("flex h-32 items-center justify-center", gradient)}>
            <Icon className="h-12 w-12 text-foreground transition-transform group-hover:scale-110" />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
