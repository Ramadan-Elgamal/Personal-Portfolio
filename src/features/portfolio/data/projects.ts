import type { Project } from "../types/projects"

export const PROJECTS: Project[] = [
  {
    id: "codespark-ai",
    title: "CodeSpark AI",
    period: {
      start: "2025",
    },
    link: "https://github.com/Ramadan-Elgamal/CodeSpark",
    skills: [
      "Personal Project",
      "Next.js",
      "TypeScript",
      "Google AI",
      "Tailwind CSS",
    ],
    description: `AI-Powered Course Generation Platform
- Built a full-stack web application that generates comprehensive programming curricula using Google AI
- Real-time course creation with progress tracking
- Shareable course links for collaboration`,
    isExpanded: true,
  },
  {
    id: "codeclips",
    title: "CodeClips",
    period: {
      start: "2025",
    },
    link: "https://github.com/Ramadan-Elgamal/CodeClips",
    skills: ["Personal Project", "React", "TypeScript", "Content Curation"],
    description: `Tutorial Discovery Platform
- Mission-driven curation to help developers break "tutorial hell"
- Hand-picked high-quality, project-based coding tutorials
- Organized learning paths for efficient skill development`,
  },
  {
    id: "lms",
    title: "Learning Management System",
    period: {
      start: "2024",
    },
    link: "https://github.com/Ramadan-Elgamal/lms-app",
    skills: [
      "Personal Project",
      "Next.js",
      "TypeScript",
      "Stripe",
      "Video Streaming",
    ],
    description: `Comprehensive E-Learning Platform
- Developed course creation and management features
- Integrated secure payment processing
- Built video streaming capabilities for course content`,
  },
]
