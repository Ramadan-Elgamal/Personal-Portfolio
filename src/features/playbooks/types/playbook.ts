export type PlaybookMetadata = {
  title: string
  description: string
  language: string
  category?: string
  tags?: string[]
  difficulty?: "beginner" | "intermediate" | "advanced"
  date: string
  related?: string[]
  image?: string
}

export type Playbook = {
  metadata: PlaybookMetadata
  slug: string
  language: string
  content: string
}

export type PlaybookPreview = {
  slug: string
  title: string
  description: string
  language: string
  difficulty?: string
}
