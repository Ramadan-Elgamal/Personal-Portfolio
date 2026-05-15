import { notFound } from "next/navigation"
import { use } from "react"

import { MDX } from "@/components/mdx"
import { Container } from "@/components/ui/container"
import {
  getLanguages,
  getPlaybookBySlug,
  getPlaybooksByLanguage,
} from "@/features/playbooks/data/playbooks"
import type { Playbook } from "@/features/playbooks/types/playbook"

export function generateStaticParams() {
  const languages = getLanguages()
  const params: Array<{ language: string; slug: string }> = []

  for (const language of languages) {
    const playbooks = getPlaybooksByLanguage(language)
    playbooks.forEach((playbook) => {
      params.push({
        language,
        slug: playbook.slug,
      })
    })
  }

  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ language: string; slug: string }>
}) {
  const { language, slug } = await params
  const playbook = getPlaybookBySlug(language, slug)

  if (!playbook) {
    return {}
  }

  return {
    title: playbook.metadata.title,
    description: playbook.metadata.description,
    openGraph: {
      title: playbook.metadata.title,
      description: playbook.metadata.description,
      type: "article",
      publishedTime: playbook.metadata.date,
      images: playbook.metadata.image
        ? [
            {
              url: playbook.metadata.image,
              width: 1200,
              height: 630,
              type: "image/png",
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: playbook.metadata.title,
      description: playbook.metadata.description,
      images: playbook.metadata.image ? [playbook.metadata.image] : undefined,
    },
  }
}

function PlaybookStructuredData({
  playbook,
  language,
}: {
  playbook: Playbook
  language: string
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: playbook.metadata.title,
          description: playbook.metadata.description,
          datePublished: playbook.metadata.date,
          keywords: playbook.metadata.tags?.join(", "),
          author: {
            "@type": "Person",
            name: "Chanhdai",
            url: "https://chanhdai.com",
          },
          articleSection: language,
        }),
      }}
    />
  )
}

export default function PlaybookDetailPage({
  params,
}: {
  params: Promise<{ language: string; slug: string }>
}) {
  const { language, slug } = use(params)
  const playbook = getPlaybookBySlug(language, slug)

  if (!playbook) {
    notFound()
  }

  return (
    <>
      <PlaybookStructuredData playbook={playbook} language={language} />
      <Container className="py-12">
        <article className="space-y-12">
          <div className="space-y-4 text-center">
            <div className="border border-border bg-[#050505] p-10 text-center">
              <div className="mx-auto mb-10 flex h-24 w-24 items-center justify-center border border-border/70 bg-black/40">
                <span className="text-4xl leading-none text-white">⚡</span>
              </div>

              <p className="mb-4 text-sm font-medium tracking-[0.3em] text-muted-foreground/80 uppercase">
                {language}
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
                {playbook.metadata.title}
              </h1>

              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-balance text-white/90 md:text-xl">
                {playbook.metadata.description}
              </p>
            </div>
          </div>

          <div className="prose max-w-none dark:prose-invert">
            <MDX code={playbook.content} />
          </div>
        </article>
      </Container>
    </>
  )
}
