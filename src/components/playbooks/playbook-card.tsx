import { ZapIcon } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"

type PlaybookCardProps = {
  href: string
  title: string
  description: string
  eyebrow?: string
  className?: string
}

export function PlaybookCard({
  href,
  title,
  description,
  eyebrow,
  className,
}: PlaybookCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative block overflow-hidden border border-border bg-[#050505] p-10 text-center text-foreground transition-transform duration-300 hover:-translate-y-1 hover:border-foreground/40 hover:shadow-2xl hover:shadow-black/30 md:p-12",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          backgroundPosition: "center",
          maskImage:
            "radial-gradient(circle at center, black 0%, black 46%, transparent 84%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 0%, black 46%, transparent 84%)",
        }}
      />

      <div className="relative mx-auto mb-10 flex h-24 w-24 items-center justify-center border border-border/70 bg-black/40 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition-transform duration-300 group-hover:scale-105">
        <ZapIcon className="h-11 w-11 text-white" />
      </div>

      {eyebrow ? (
        <p className="relative mb-4 text-sm font-medium tracking-[0.3em] text-muted-foreground/80 uppercase">
          {eyebrow}
        </p>
      ) : null}

      <h3 className="relative text-3xl font-semibold tracking-tight text-white md:text-4xl">
        {title}
      </h3>

      <p className="relative mx-auto mt-5 max-w-xl text-lg leading-8 text-balance text-white/90 md:text-xl">
        {description}
      </p>
    </Link>
  )
}
