#!/usr/bin/env node
/**
 * Migration script to add frontmatter to existing playbook markdown files
 * Run with: node scripts/migrate-playbooks.mjs
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PLAYBOOKS_DIR = path.join(__dirname, "..", "src", "features", "playbooks")

// Parse phase number from filename (e.g., "phase-1.md" -> 1)
function extractPhaseNumber(filename) {
    const match = filename.match(/phase-(\d+(?:\.\d+)?)/)
    return match ? match[1] : null
}

// Generate slug from filename
function generateSlug(filename) {
    return filename.replace(/\.mdx?$/, "")
}

// Estimate difficulty based on phase number
function estimateDifficulty(phaseNum) {
    const num = parseFloat(phaseNum)
    if (num <= 3) return "beginner"
    if (num <= 10) return "intermediate"
    return "advanced"
}

// Generate frontmatter for a playbook
function generateFrontmatter(filename, language) {
    const slug = generateSlug(filename)
    const phaseNum = extractPhaseNumber(filename)

    const frontmatter = {
        title: `Phase ${phaseNum}: ${capitalizeWords(slug.replace(/phase-\d+(?:\.\d+)?-?/, ""))}`,
        description: `Learn phase ${phaseNum} of the ${language} playbook architecture pattern.`,
        language,
        category: "playbook",
        tags: [language, "architecture", `phase-${phaseNum}`],
        difficulty: estimateDifficulty(phaseNum),
        date: new Date().toISOString().split("T")[0],
        slug,
        related: [],
    }

    return formatFrontmatter(frontmatter)
}

// Format object as YAML frontmatter
function formatFrontmatter(obj) {
    let yaml = "---\n"
    for (const [key, value] of Object.entries(obj)) {
        if (key === "related") {
            yaml += `${key}: []\n`
        } else if (Array.isArray(value)) {
            yaml += `${key}:\n`
            value.forEach((item) => {
                yaml += `  - ${item}\n`
            })
        } else if (typeof value === "string") {
            yaml += `${key}: "${value}"\n`
        } else {
            yaml += `${key}: ${value}\n`
        }
    }
    yaml += "---\n"
    return yaml
}

function capitalizeWords(str) {
    return str
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}

// Main migration function
async function migratePlaybooks() {
    console.log(`Starting playbook migration from: ${PLAYBOOKS_DIR}`)

    const languages = fs
        .readdirSync(PLAYBOOKS_DIR)
        .filter((file) =>
            fs.statSync(path.join(PLAYBOOKS_DIR, file)).isDirectory()
        )

    for (const language of languages) {
        const languageDir = path.join(PLAYBOOKS_DIR, language)
        const files = fs
            .readdirSync(languageDir)
            .filter((file) => file.endsWith(".md"))

        console.log(`\nProcessing ${language} (${files.length} files)...`)

        for (const file of files) {
            const filePath = path.join(languageDir, file)
            const content = fs.readFileSync(filePath, "utf-8")

            // Skip if already has frontmatter
            if (content.startsWith("---")) {
                console.log(`  ✓ ${file} (already has frontmatter)`)
                continue
            }

            // Add frontmatter
            const frontmatter = generateFrontmatter(file, language)
            const newContent = frontmatter + content
            const newFilePath = filePath.replace(/\.md$/, ".mdx")

            fs.writeFileSync(newFilePath, newContent, "utf-8")

            // Remove old .md file if different from .mdx
            if (filePath !== newFilePath) {
                fs.unlinkSync(filePath)
                console.log(`  ✓ ${file} → ${path.basename(newFilePath)}`)
            } else {
                console.log(`  ✓ ${file} (updated with frontmatter)`)
            }
        }
    }

    console.log("\n✅ Migration complete!")
}

migratePlaybooks().catch(console.error)
