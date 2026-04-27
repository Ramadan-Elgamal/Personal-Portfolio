import type { User } from "@/features/portfolio/types/user"

export const USER: User = {
  firstName: "Ramadan",
  lastName: "Elgamal",
  displayName: "RRR",
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
  phoneNumber: "KzIwMTE0MjU0NDgxNg==", // E.164 format, base64 encoded (https://t.io.vn/base64-string-converter)
  email: "cmFtYWRhbmVsZ2FtYWwyMUBnbWFpbC5jb20=", // base64 encoded
  website: "https://ramadanalgamal.netlify.app",
  jobTitle: "Software Engineer",
  jobs: [
    {
      title: "Open Source Student",
      company: "ITI",
      website: "https://iti.gov.eg",
      experienceId: "iti",
    },
  ],
  about: `Hey! I’m **Ramadan**, but the internet usually knows me as **Butsher** (or Botsher) ✌️. 

I’m a frontend-leaning developer who believes that if the code doesn’t "vibe," it isn’t finished. I spend my days turning complex ideas into sleek interfaces and my nights trying to figure out why my dual-boot setup is acting up again. 🐧

When I’m not in the middle of an intensive **ITI** session or fine-tuning an automation script, you can probably find me:

* ♟️ **Calculatedly losing at chess** (usually because I tried a risky gambit for the drama).
* 🎬 **Chasing my 1,000-movie goal**—my Letterboxd is basically my second home.
* OS-hopping between **Ubuntu and RHEL** just to feel something. 💻
* 🕹️ **Reliving the 90s** through a retro emulator because modern graphics are cool, but nostalgia is better.

I’m also currently adding **Spanish** to my vocabulary, so if my code starts looking like a "telenovela," you’ll know why. 🇪🇸

I love building things that look great, work perfectly, and maybe have a little bit of soul. If you want to talk shop, discuss cinema, or challenge me to a match on Lichess, I’m your guy! 🚀✨`,
  avatar: "https://github.com/Ramadan-Elgamal.png",
  ogImage: "/logo-dark.svg",
  namePronunciationUrl: "",
  timeZone: "Africa/Cairo",
  keywords: [
    "ramadan elgamal",
    "rrr",
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
