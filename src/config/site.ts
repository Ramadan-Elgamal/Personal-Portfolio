import { USER } from "@/features/portfolio/data/user"
import type { NavItem } from "@/types/nav"

export const SITE_INFO = {
  name: USER.displayName,
  url: process.env.APP_URL || "https://ramadanelgamal.com",
  ogImage: USER.ogImage,
  description: USER.bio,
  keywords: USER.keywords,
}

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}

export const MAIN_NAV: NavItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "UI",
    href: "/components",
  },
  {
    title: "Blog",
    href: "/blog",
  },
  // {
  //   title: "Sponsors",
  //   href: "/sponsors",
  // },
]

export const X_USERNAME = ""
export const GITHUB_USERNAME = "Ramadan-Elgamal"
export const SOURCE_CODE_GITHUB_REPO = "Ramadan-Elgamal/portfolio"
export const SOURCE_CODE_GITHUB_URL =
  "https://github.com/Ramadan-Elgamal/portfolio"

export const SPONSORSHIP_URL = "https://github.com/sponsors/Ramadan-Elgamal"

export const UTM_PARAMS = {
  utm_source: "ramadanelgamal.com",
}
