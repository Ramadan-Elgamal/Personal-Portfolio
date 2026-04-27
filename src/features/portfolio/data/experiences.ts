import type { Experience } from "../types/experiences"

export const EXPERIENCES: Experience[] = [
  {
    id: "iti",
    companyName: "Information Technology Institute (ITI)",
    companyLogo: "/iti-logo.png",
    companyWebsite: "https://iti.gov.eg",
    positions: [
      {
        id: "1",
        title: "Open Source Applications Development Program",
        employmentPeriod: {
          start: "10.2025",
          end: "09.2026",
        },
        employmentType: "Full-time",
        icon: "code",
        description:
          "- Participated in a 11-month intensive training program in Open Source Applications Development.\n- Completed 1,458 hours of hands-on labs and technical lectures focused on practical software development. ([View full details](https://docs.google.com/spreadsheets/u/0/d/1wSi7LM4XmV4nwoj7x3rnu-yPq8rPy003vff1hIqUooo/htmlview#gid=0))\n- Enhanced professional communication and project presentation skills through 99 hours of intensive Business English training.",
        skills: ["Linux", "Open Source", "Software Development"],
        isExpanded: true,
      },
    ],
    isCurrentEmployer: true,
  },
  {
    id: "depi",
    companyName: "Digital Egypt Pioneers Initiative (DEPI)",
    companyLogo: "/depi-logo.png",
    positions: [
      {
        id: "1",
        title: "Fullstack Trainee",
        employmentPeriod: {
          start: "10.2024",
          end: "05.2025",
        },
        employmentType: "Full-time",
        icon: "code",
        description:
          "- **Key Skills:** Developed deep knowledge in MERN Stack, JavaScript (ES6+), and responsive web design.\n- Collaborated with a team to build professional-grade web applications following industry standards.",
        skills: [
          "MERN Stack",
          "JavaScript (ES6+)",
          "Responsive Web Design",
          "React",
          "Node.js",
          "MongoDB",
        ],
      },
    ],
  },
]
