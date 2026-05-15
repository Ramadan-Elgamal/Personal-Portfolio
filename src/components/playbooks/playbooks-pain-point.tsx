import { Panel } from "@/features/portfolio/components/panel"

export function PlaybooksPainPoint() {
  return (
    <Panel className="mb-16">
      <div className="px-4 py-6 md:px-6 md:py-8">
        <p className="mb-4 text-sm font-medium tracking-[0.28em] text-muted-foreground uppercase">
          The pain point
        </p>
        <h2 className="mb-5 text-3xl font-semibold tracking-tight md:text-4xl">
          Escape Tutorial Hell.
        </h2>
        <p className="max-w-4xl text-lg leading-8 text-balance text-muted-foreground md:text-xl">
          The internet is full of crash courses that teach you syntax, but
          nobody teaches you how to string it all together. These playbooks
          eliminate decision fatigue by giving you the exact folder structures,
          design patterns, and boundaries used by senior engineers.
        </p>
      </div>
    </Panel>
  )
}

export default PlaybooksPainPoint
