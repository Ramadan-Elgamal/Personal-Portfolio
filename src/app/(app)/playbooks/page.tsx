import Link from "next/link"

import { PlaybookCard } from "@/components/playbooks/playbook-card"
import { Container } from "@/components/ui/container"
import {
  getAllPlaybooks,
  getLanguages,
} from "@/features/playbooks/data/playbooks"

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
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-5xl font-bold">Playbooks</h1>
        <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
          Production-ready architectural patterns and best practices. Eliminate
          decision fatigue and learn how to build enterprise-grade applications.
        </p>
      </div>

      {/* Languages Grid */}
      <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {languages.map((language) => {
          const count = playbooksByLanguage[language].length
          const displayName =
            language.charAt(0).toUpperCase() + language.slice(1)

          return (
            <PlaybookCard
              key={language}
              href={`/playbooks/${language}`}
              title={displayName}
              description={`${count} playbook${count !== 1 ? "s" : ""}`}
            />
          )
        })}
      </div>

      {/* Recent Playbooks */}
      <div className="mb-12">
        <h2 className="mb-8 text-3xl font-bold">Recent Playbooks</h2>
        <div className="grid grid-cols-1 gap-6">
          {allPlaybooks.slice(0, 5).map((playbook) => (
            <PlaybookCard
              key={`${playbook.language}-${playbook.slug}`}
              href={`/playbooks/${playbook.language}/${playbook.slug}`}
              eyebrow={playbook.language}
              title={playbook.metadata.title}
              description={playbook.metadata.description}
            />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="border border-border bg-card p-8 text-center">
        <h3 className="mb-3 text-2xl font-bold">Start Learning</h3>
        <p className="mb-6 text-muted-foreground">
          Pick a language and dive into production-ready architecture patterns.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {languages.slice(0, 3).map((language) => (
            <Link
              key={language}
              href={`/playbooks/${language}`}
              className="bg-primary px-4 py-2 text-primary-foreground capitalize transition-opacity hover:opacity-90"
            >
              {language}
            </Link>
          ))}
        </div>
      </div>
    </Container>
  )
}
