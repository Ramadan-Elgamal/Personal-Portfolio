import { getLanguages } from "@/features/playbooks/data/playbooks"

export function generateStaticParams() {
  return getLanguages().map((language) => ({
    language,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ language: string }>
}) {
  const { language } = await params
  const displayName = language.charAt(0).toUpperCase() + language.slice(1)

  return {
    title: `${displayName} Playbooks`,
    description: `Production-ready architectural playbooks and best practices for ${language}`,
    openGraph: {
      title: `${displayName} Playbooks`,
      description: `Production-ready architectural playbooks and best practices for ${language}`,
    },
  }
}

export default function PlaybookLanguageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
