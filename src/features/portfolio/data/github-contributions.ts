import { unstable_cache } from "next/cache"

import type { Activity } from "@/components/kibo-ui/contribution-graph"
import { GITHUB_USERNAME } from "@/config/site"

type GitHubContributionsResponse = {
  contributions: Activity[]
}

const GITHUB_CONTRIBUTIONS_API_URL =
  process.env.GITHUB_CONTRIBUTIONS_API_URL ??
  "https://github-contributions-api.jogruber.de"

export const getGitHubContributions = unstable_cache(
  async () => {
    try {
      const res = await fetch(
        `${GITHUB_CONTRIBUTIONS_API_URL.replace(/\/$/, "")}/v4/${GITHUB_USERNAME}?y=last`
      )
      const data = (await res.json()) as GitHubContributionsResponse
      return data.contributions
    } catch {
      return []
    }
  },
  ["github-contributions"],
  { revalidate: 86400 } // Cache for 1 day (86400 seconds)
)
