import { Panel } from "@/features/portfolio/components/panel"

type MethodItemProps = {
  index: string
  title: string
  description: string
}

function MethodItem({ index, title, description }: MethodItemProps) {
  return (
    <div className="flex gap-4 border border-border bg-card p-5">
      <div className="flex h-10 w-10 flex-none items-center justify-center border border-border bg-background text-sm font-semibold">
        {index}
      </div>
      <div>
        <h3 className="mb-2 text-base font-semibold">{title}</h3>
        <p className="text-sm leading-7 text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export function PlaybooksMethodology() {
  return (
    <Panel className="mb-16">
      <div className="px-4 py-6 md:px-6 md:py-8">
        <p className="mb-4 text-sm font-medium tracking-[0.28em] text-muted-foreground uppercase">
          Methodology
        </p>
        <h2 className="mb-6 text-3xl font-semibold tracking-tight md:text-4xl">
          How the playbooks teach.
        </h2>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <MethodItem
            index="01"
            title="Opinionated"
            description="We don't give you 5 ways to do something; we give you the best way for production."
          />
          <MethodItem
            index="02"
            title="Docs-as-Code"
            description="Every step is copy-pasteable, but we explain the why before the what."
          />
          <MethodItem
            index="03"
            title="Strict Boundaries"
            description="You will learn exact rules of engagement. Controllers handle HTTP, Services handle logic."
          />
        </div>
      </div>
    </Panel>
  )
}

export default PlaybooksMethodology
