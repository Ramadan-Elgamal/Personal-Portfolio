import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Panel } from "@/features/portfolio/components/panel"

export function PlaybooksNewsletter() {
  return (
    <Panel className="mb-16">
      <div className="px-4 py-6 md:px-6 md:py-8">
        <p className="mb-4 text-sm font-medium tracking-[0.28em] text-muted-foreground uppercase">
          Stay in the loop
        </p>
        <h2 className="mb-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Get notified when new architectures drop.
        </h2>
        <p className="mb-6 max-w-2xl text-lg leading-8 text-balance text-muted-foreground">
          No spam. Just an alert when the Vue or NestJS playbooks go live.
        </p>

        <form className="flex max-w-xl flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="playbooks-email">
            Email address
          </label>
          <Input
            id="playbooks-email"
            type="email"
            placeholder="Enter your email"
            className="h-11 bg-background"
          />
          <Button type="submit" className="h-11 px-6 sm:flex-none">
            Notify me
          </Button>
        </form>
      </div>
    </Panel>
  )
}

export default PlaybooksNewsletter
