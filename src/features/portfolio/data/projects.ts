import type { Project } from "../types/projects"

export const PROJECTS: Project[] = [
  {
    id: "irb",
    title: "Research Approval Management System (IRB)",
    period: { start: "2026" },
    skills: ["PHP", "MVC", "MySQL", "Tailwind CSS v4"],
    description: `Medical Research Approval Management
- Built a custom MVC PHP framework from scratch to manage the 9-step lifecycle of medical research approvals.
- Designed a secure relational database in MySQL to handle multi-role access (Students, Admins, Reviewers), file tracking, and blind review processes.`,
    isExpanded: true,
  },
  {
    id: "clinic-os",
    title: "Clinic OS",
    period: { start: "2026" },
    skills: ["Django", "MySQL", "HTML", "CSS"],
    description: `Full-Stack Clinic Management System
- Architected and built a full-stack clinic management system using Django 6.0 + MySQL, implementing 4 distinct role-based portals (Patient/Doctor/Receptionist/Admin) with custom RBAC decorators and 8-state appointment workflow engine.
- Engineered smart scheduling algorithm preventing double-bookings and enforcing configurable buffer times; designed availability slot system handling recurring schedules, exceptions, and real-time queue management across 20+ integrated views.`,
  },
  {
    id: "khamsat-ai",
    title: "Khamsat AI",
    period: { start: "2026" },
    skills: ["Next.js 16", "Clerk", "MongoDB", "Google GenAI"],
    description: `Full-Stack AI-Powered SaaS Application
- Helped freelancers create optimized service listings for Khamsat by generating complete service copy and SEO keywords.
- Integrated third-party AI services & image generation APIs, combining Google GenAI for content generation with Pollinations.ai for dynamic thumbnail creation, reducing listing creation time from hours to minutes.
- Features shipped: Authentication, AI generation, thumbnail creation, history management, bilingual support.`,
  },
  {
    id: "lms",
    title: "LMS Platform",
    period: { start: "2025" },
    link: "https://github.com/Ramadan-Elgamal/lms-app",
    skills: ["Personal Project", "MERN", "Clerk", "Stripe"],
    description: `Full-Stack Learning Management System
- Architected and developed a full-stack LMS platform with role-based interfaces for educators and students.
- Integrated third-party payment processing via Stripe API with secure checkout sessions and webhook handlers for transaction lifecycle management, enabling real-time course enrollment and revenue tracking.`,
  },
  {
    id: "codespark",
    title: "CodeSpark",
    link: "https://github.com/Ramadan-Elgamal/CodeSpark",
    period: { start: "2025" },
    skills: ["Next.js", "TypeScript", "Genkit AI"],
    description: `AI Course Generation Platform
- Engineered a full-stack AI course generation platform featuring intelligent curriculum creation, real-time editing capabilities, and URL-based sharing, delivering a complete learning management system with progress tracking and resource curation.`,
  },
  {
    id: "codeclips",
    title: "CodeClips",
    link: "https://github.com/Ramadan-Elgamal/CodeClips",
    period: { start: "2025" },
    skills: ["Next.js", "TypeScript", "Firebase", "Genkit AI"],
    description: `Full-Stack Tutorial Discovery Platform
- Engineered a full-stack tutorial discovery platform, delivering 10+ distinct routes (category browsing, tutorial detail, saved lists, auth flows, content submission).
- Integrated Google AI via Firebase Genkit alongside Firebase backend services.`,
  },
  {
    id: "blog-app",
    title: "BLOG App",
    period: { start: "2026" },
    skills: ["Node.js", "Express", "MongoDB"],
    description: `Production-Grade RESTful API
- Built a production-grade RESTful API built with Node.js/Express, featuring authentication, payment integration, multi-layered security, and MVC architecture.
- Integrated third-party payment gateway (Kashier) with webhook handling and cryptographic signature verification for secure donation processing.`,
  },
]
