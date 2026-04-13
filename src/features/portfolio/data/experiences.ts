import type { Experience } from "../types/experiences"

export const EXPERIENCES: Experience[] = [
  {
    id: "iti",
    companyName: "Information Technology Institute (ITI)",
    companyLogo: "https://cdn.simpleicons.org/linux",
    companyWebsite: "https://iti.gov.eg",
    positions: [
      {
        id: "1",
        title: "Open Source 9-Month Program",
        employmentPeriod: {
          start: "2025",
        },
        employmentType: "Full-time",
        icon: "code",
        description:
          "- Enrolled in ITI's intensive Open Source program focusing on building robust, scalable web architectures.\n- Deepening expertise in modern frontend and fullstack development practices.\n- Working with Linux, open source technologies, and enterprise-grade tools.",
        skills: [
          "React",
          "Next.js",
          "TypeScript",
          "Node.js",
          "Linux",
          "Open Source",
        ],
        isExpanded: true,
      },
    ],
    isCurrentEmployer: true,
  },
  {
    id: "depi",
    companyName: "DEPI",
    companyLogo: "https://cdn.simpleicons.org/react",
    positions: [
      {
        id: "1",
        title: "Fullstack Trainee",
        employmentPeriod: {
          start: "2024",
          end: "2024",
        },
        employmentType: "Full-time",
        icon: "code",
        description:
          "- Completed 7-month intensive fullstack development training.\n- Gained hands-on experience with modern web technologies and best practices.\n- Built multiple projects using React, Node.js, and databases.",
        skills: [
          "React",
          "Node.js",
          "JavaScript",
          "HTML",
          "CSS",
          "MongoDB",
          "MySQL",
        ],
      },
    ],
  },
]
