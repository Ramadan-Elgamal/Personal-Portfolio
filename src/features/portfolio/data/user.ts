import type { User } from "@/features/portfolio/types/user"

export const USER: User = {
  firstName: "Ramadan",
  lastName: "Elgamal",
  displayName: "R3B",
  username: "Ramadan-Elgamal",
  gender: "male",
  pronouns: "he/him",
  bio: "I am an Egyptian software developer and Computer Science graduate with three years of experience specializing in frontend development.",
  flipSentences: [
    "Frontend Developer",
    "Open Source Enthusiast",
    "Building Meaningful Things",
  ],
  address: "Dakahlia, Egypt",
  phoneNumber: "", // E.164 format, base64 encoded (https://t.io.vn/base64-string-converter)
  email: "cmFtYWRhbmVsZ2FtYWwyMUBnbWFpbC5jb20=", // base64 encoded
  website: "https://ramadanelgamal.com",
  jobTitle: "Software Engineer",
  jobs: [
    {
      title: "Open Source Student",
      company: "ITI",
      website: "https://iti.gov.eg",
      experienceId: "iti",
    },
  ],
  about: `
- **Software Engineer** with 3+ years of experience specializing in **frontend development**.
- Computer Science graduate currently enrolled in the **ITI Open Source 9-Month program**, focusing on building robust, scalable web architectures.
- Skilled in **React**, **Next.js**, **TypeScript**, and modern front-end technologies.
- Passionate about open source and building meaningful projects that solve real problems.
- Creator of [CodeSpark AI](https://github.com/Ramadan-Elgamal/CodeSpark): AI-powered course generation platform using Google AI
- Creator of [CodeClips](https://github.com/Ramadan-Elgamal/CodeClips): Tutorial discovery platform to help developers break "tutorial hell"
- Creator of [Learning Management System](https://github.com/Ramadan-Elgamal/lms-app): E-learning platform with course creation, payments, and video streaming
`,
  avatar: "https://github.com/Ramadan-Elgamal.png",
  ogImage: "https://github.com/Ramadan-Elgamal.png",
  namePronunciationUrl: "",
  timeZone: "Africa/Cairo",
  keywords: [
    "ramadan elgamal",
    "r3b",
    "ramadan-elgamal",
    "software engineer",
    "frontend developer",
    "react developer",
    "nextjs developer",
    "egypt developer",
    "iti",
    "open source",
  ],
  dateCreated: "2026-03-08", // YYYY-MM-DD
}
