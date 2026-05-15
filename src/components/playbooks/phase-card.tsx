import { ZapIcon } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"

type PhaseCardProps = {
  href: string
  title: string
  description: string
  eyebrow?: string
  slug?: string
  className?: string
}

function extractPhase(slug?: string) {
  if (!slug) return null
  const m = slug.match(/(\d+(?:\.\d+)?)/)
  return m ? m[1] : null
}

export function PhaseCard({
  href,
  title,
  description,
  eyebrow,
  slug,
  className,
}: PhaseCardProps) {
  const phase = extractPhase(slug)

  return (
    <Link
      href={href}
      className={cn(
        "group flex items-start gap-4 overflow-hidden rounded-none border border-border bg-card p-4 text-foreground transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="rounded-border flex h-14 w-14 flex-none items-center justify-center bg-black text-white">
        {phase ? (
          <span className="text-lg font-semibold">{phase}</span>
        ) : (
          <ZapIcon className="h-6 w-6" />
        )}
      </div>

      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
            {eyebrow}
          </p>
        ) : null}

        <h3 className="text-sm leading-tight font-semibold text-foreground">
          {title}
        </h3>
        {description ? (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
    </Link>
  )
}

export default PhaseCard
