import { notFound } from "next/navigation"
import { use } from "react"

import { PlaybookCard } from "@/components/playbooks/playbook-card"
import { Container } from "@/components/ui/container"
import {
  getLanguages,
  getPlaybooksByLanguage,
} from "@/features/playbooks/data/playbooks"

export function generateStaticParams() {
  return getLanguages().map((language) => ({
    language,
  }))
}

export default function PlaybookLanguagePage({
  params,
}: {
  params: Promise<{ language: string }>
}) {
  const { language } = use(params)
  const playbooks = getPlaybooksByLanguage(language)

  if (playbooks.length === 0) {
    notFound()
  }

  const displayName = language.charAt(0).toUpperCase() + language.slice(1)

  return (
    <Container className="py-12">
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold">{displayName} Playbooks</h1>
        <p className="text-lg text-muted-foreground">
          Production-ready architectural patterns and best practices for{" "}
          {language}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {playbooks.map((playbook) => (
          <PlaybookCard
            key={playbook.slug}
            href={`/playbooks/${language}/${playbook.slug}`}
            eyebrow={language}
            title={playbook.metadata.title}
            description={playbook.metadata.description}
          />
        ))}
      </div>
    </Container>
  )
}
