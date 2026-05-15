import Image from "next/image"
import Link from "next/link"

import PhaseCard from "@/components/playbooks/phase-card"
import { PlaybookCard } from "@/components/playbooks/playbook-card"
import { PlaybooksMethodology } from "@/components/playbooks/playbooks-methodology"
import { PlaybooksNewsletter } from "@/components/playbooks/playbooks-newsletter"
import { PlaybooksPainPoint } from "@/components/playbooks/playbooks-pain-point"
import SectionSeparator from "@/components/section-separator"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import {
  getAllPlaybooks,
  getLanguages,
} from "@/features/playbooks/data/playbooks"
import { Panel } from "@/features/portfolio/components/panel"

const languageIcons: Record<string, React.ReactNode> = {
  nodejs: (
    <Image
      src="/tech-stack-icons/nodejs.svg"
      alt="Node.js"
      width={44}
      height={44}
    />
  ),
  node: (
    <Image
      src="/tech-stack-icons/nodejs.svg"
      alt="Node.js"
      width={44}
      height={44}
    />
  ),
  javascript: (
    <Image
      src="/tech-stack-icons/javascript.svg"
      alt="JavaScript"
      width={44}
      height={44}
    />
  ),
  typescript: (
    <Image
      src="/tech-stack-icons/typescript.svg"
      alt="TypeScript"
      width={44}
      height={44}
    />
  ),
  python: (
    <Image
      src="/tech-stack-icons/python.svg"
      alt="Python"
      width={44}
      height={44}
    />
  ),
  react: (
    <Image
      src="/tech-stack-icons/react.svg"
      alt="React"
      width={44}
      height={44}
    />
  ),
  vuejs: (
    <Image
      src="/tech-stack-icons/vue.svg"
      alt="Vue.js"
      width={44}
      height={44}
    />
  ),
  vue: (
    <Image
      src="/tech-stack-icons/vue.svg"
      alt="Vue.js"
      width={44}
      height={44}
    />
  ),
  laravel: (
    <Image
      src="/tech-stack-icons/laravel.svg"
      alt="Laravel"
      width={44}
      height={44}
    />
  ),
}

export const metadata = {
  title: "Playbooks",
  description:
    "Production-ready architectural playbooks and best practices for programming languages and libraries.",
}

export default function PlaybooksPage() {
  const languages = getLanguages()
  const allPlaybooks = getAllPlaybooks()

  const playbooksByLanguage = languages.reduce(
    (acc, lang) => {
      acc[lang] = allPlaybooks.filter((p) => p.language === lang)
      return acc
    },
    {} as Record<string, typeof allPlaybooks>
  )

  return (
    <Container className="py-12">
      {/* Hero Section */}
      <Panel className="mb-16 text-center">
        <div className="px-4 py-6 md:px-6 md:py-8">
          <h1 className="mb-4 text-4xl font-bold">
            Stop writing scripts. Start engineering systems.
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Opinionated, step-by-step architectural playbooks to take you from
            &quot;Hello World&quot; to production-ready enterprise applications.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg">
              <Link href="#playbooks">Choose a playbook</Link>
            </Button>
          </div>
        </div>
      </Panel>

      <SectionSeparator />

      <PlaybooksPainPoint />

      <SectionSeparator />

      <PlaybooksMethodology />

      <SectionSeparator />

      {/* Languages Grid */}
      <Panel id="playbooks" className="mb-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {languages.map((language) => {
            const count = playbooksByLanguage[language].length
            const displayName =
              language.charAt(0).toUpperCase() + language.slice(1)
            const icon = languageIcons[language.toLowerCase()]

            return (
              <PlaybookCard
                key={language}
                href={`/playbooks/${language}`}
                title={displayName}
                description={`${count} playbook${count !== 1 ? "s" : ""}`}
                icon={icon}
              />
            )
          })}
        </div>
      </Panel>

      {/* Recent Phases  */}
      <Panel className="mb-12">
        <div className="px-4">
          <h2 className="mb-8 text-3xl font-bold">Recent Playbooks</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allPlaybooks.slice(0, 6).map((playbook) => (
              <PhaseCard
                key={`${playbook.language}-${playbook.slug}`}
                href={`/playbooks/${playbook.language}/${playbook.slug}`}
                slug={playbook.slug}
                eyebrow={playbook.language}
                title={playbook.metadata.title}
                description={playbook.metadata.description}
              />
            ))}
          </div>
        </div>
      </Panel>

      <SectionSeparator />

      <PlaybooksNewsletter />
    </Container>
  )
}
