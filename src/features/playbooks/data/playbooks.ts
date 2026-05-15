import fs from "fs"
import matter from "gray-matter"
import path from "path"
import { cache } from "react"

import type {
  Playbook,
  PlaybookMetadata,
} from "@/features/playbooks/types/playbook"

function parseFrontmatter(fileContent: string) {
  const file = matter(fileContent)

  return {
    metadata: file.data as PlaybookMetadata,
    content: file.content,
  }
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx")
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8")
  return parseFrontmatter(rawContent)
}

function getMDXData(dir: string, language: string) {
  const mdxFiles = getMDXFiles(dir)

  return mdxFiles.map<Playbook>((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file))

    const slug = path.basename(file, path.extname(file))

    return {
      metadata,
      slug,
      language,
      content,
    }
  })
}

export const getAllPlaybooks = cache(() => {
  const playbooksDir = path.join(process.cwd(), "src/features/playbooks")
  const excludedFolders = ["data", "types"]
  const languages = fs.readdirSync(playbooksDir).filter((file) => {
    if (excludedFolders.includes(file)) return false
    return fs.statSync(path.join(playbooksDir, file)).isDirectory()
  })

  const allPlaybooks: Playbook[] = []

  for (const language of languages) {
    const languageDir = path.join(playbooksDir, language)
    const playbooks = getMDXData(languageDir, language)
    allPlaybooks.push(...playbooks)
  }

  return allPlaybooks.sort((a, b) => {
    return (
      new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
    )
  })
})

export function getPlaybookBySlug(language: string, slug: string) {
  return getAllPlaybooks().find(
    (playbook) => playbook.slug === slug && playbook.language === language
  )
}

export function getPlaybooksByLanguage(language: string) {
  return getAllPlaybooks()
    .filter((playbook) => playbook.language === language)
    .sort((a, b) => {
      // Extract phase numbers from slugs (e.g., "phase-1" -> 1, "phase-12.5" -> 12.5)
      const aMatch = a.slug.match(/phase-(\d+(?:\.\d+)?)/)
      const bMatch = b.slug.match(/phase-(\d+(?:\.\d+)?)/)

      const aPhase = aMatch ? parseFloat(aMatch[1]) : 0
      const bPhase = bMatch ? parseFloat(bMatch[1]) : 0

      return aPhase - bPhase
    })
}

export function getLanguages() {
  const playbooksDir = path.join(process.cwd(), "src/features/playbooks")
  const excludedFolders = ["data", "types"]
  return fs
    .readdirSync(playbooksDir)
    .filter((file) => {
      if (excludedFolders.includes(file)) return false
      return fs.statSync(path.join(playbooksDir, file)).isDirectory()
    })
    .sort()
}

export function findPlaybookNeighbours(playbooks: Playbook[], slug: string) {
  const len = playbooks.length

  for (let i = 0; i < len; ++i) {
    if (playbooks[i].slug === slug) {
      return {
        previous: i > 0 ? playbooks[i - 1] : null,
        next: i < len - 1 ? playbooks[i + 1] : null,
      }
    }
  }

  return { previous: null, next: null }
}
