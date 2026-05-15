# Playbooks Implementation — Editable Questions

Use this file to answer the design and implementation questions for the Playbooks section. Edit the answers below — I'll use them to scaffold the feature, templates, routes, and sample content.

---

## 1) Goals
- Primary goal for Playbooks (what problem should they solve?):

- Secondary goals (audience, discoverability, reuse, teaching, onboarding):

Your answers:
The Primary Goal is to eliminate decision fatigue and bridge the gap between knowing a language's syntax and shipping production-ready architecture.

The software industry is flooded with "Hello World" tutorials and beginner crash courses. However, there is a massive void of resources that teach developers how to actually string those concepts together into a secure, scalable, and maintainable enterprise application.

My playbooks solve the "Blank Canvas Paralysis." When a developer needs to build an API, they shouldn't spend two days figuring out folder structures, wiring up TypeScript, configuring ESLint, or guessing where to put business logic. Your playbooks provide an authoritative, opinionated, and production-tested path forward. They teach developers to stop writing scripts and start engineering systems.

1. Audience (Who is this for?)
This is not for absolute beginners who don't know what a variable is. Your audience consists of ambitious junior to mid-level engineers (and seniors switching to a new stack) who understand the basics but lack architectural confidence. They are tired of "tutorial hell" and want a professional mentor to show them the exact blueprint for how real teams build software.

2. Discoverability (How does it grow your authority?)
By hosting these playbooks publicly on a custom Next.js platform, you are building an SEO machine and a world-class engineering portfolio.

When a developer searches "How to structure business logic in Node.js" or "NestJS layered architecture," your playbook steps will rank.

It acts as a massive lead magnet, establishing you (the creator of zfnodejs) as an authority, an architect, and an educator in the community.

3. Reuse (The personal & community vault)
For you, this platform acts as a "Public Second Brain." You never have to remember how you wired up Redis or configured JWTs six months ago; you just reference your own playbook. For the community, it becomes a trusted library of copy-pasteable architectural patterns that drastically speed up their daily development.

4. Teaching (Mental models over syntax)
The secondary educational goal is to teach the "Why" before the "What." You aren't just giving them code; you are giving them the mental models of a Principal Engineer. By explicitly stating boundaries (e.g., "Never put database queries in the controller"), you are teaching them architectural discipline and clean code practices that transfer across any language.

5. Onboarding (The ultimate team multiplier)
A hidden superpower of a well-written playbook is team onboarding. Engineering managers and tech leads can use your platform to onboard new hires. Instead of spending hours pairing with a new developer to explain the codebase, a lead can say: "We use the zfnode architecture. Read Phase 1 through 4 of this playbook, and you will understand exactly how our codebase is structured."
---

## 2) Scope & Content Model
- What content types should each Playbook contain?
They already exists in the `src\features\playbooks` folder

- Do you prefer plain Markdown files or MDX (MDX allows React examples/components)?
MDX

- Required frontmatter fields for each playbook page (suggested):
  - `title`, `description`, `language`, `category`, `tags`, `difficulty`, `date`, `slug`, `related`

add `title`, `description`, `language`, `category`, `tags`, `difficulty`, `date`, `slug`, `related`

---

## 3) Structure & Routes
- Preferred top-level path for Playbooks (default: `/playbooks`):
the default is fine

- Listing pages needed: language index, topic index, tag index?
language index

- Detail page pattern (default): `/playbooks/[language]/[slug]` — acceptable? (yes/no)
yes

---

## 4) Editing & Authoring Workflow
- Who will author content? (you, contributors, public PRs)
Me

- Should playbooks live in the repo under `src/features/playbooks/content` (git-first), or use a CMS (headless) for editing?
they should live in the repo under `src/features/playbooks/(language)

- Do you want an optional admin/editor UI (in-site) for quick edits?
No i will just edit the mdx file.

---

## 5) Templates & Rendering
- Do playbooks need runnable sandboxed examples (iframe/embed), or are static code blocks sufficient?
static code blocks

- Do you want interactive code sandboxes (e.g., CodeSandbox or StackBlitz links)?
NO, not now

- Preferred code-language highlighting and copy behavior:
this should be a copy to clipboard button to ease the coping pasting process
---

## 6) Styling & Components
- Should playbooks use existing site components (cards, code blocks, hero) or a special layout?
they can use it

- Any brand or token variations specific to Playbooks (accent color, logo)?
follow the same as the portfolio tokens

---

## 7) SEO, Metadata & Social
- Do you want structured data (JSON-LD) per playbook page? (yes/no)
yes
---

## 8) Priorities — Which languages/frameworks to start with?
i added the files for the nodejs and soon put the vue js and other languages

---

## 9) CI & Publishing
- Should changes show up automatically on the site after merging to `main`? (yes/no)

- Should registry or `components.json` be rebuilt when playbooks change? (yes/no)

Your answers:
i don't know, choose the easiest approach
---
