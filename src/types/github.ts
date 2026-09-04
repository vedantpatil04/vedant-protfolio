export interface GitHubProfileSummary {
  login: string
  name: string | null
  avatarUrl: string
  bio: string | null
  company: string | null
  location: string | null
  blog: string | null
  htmlUrl: string
  followers: number
  following: number
  publicRepos: number
  memberSince: string
}

export interface GitHubRepoSummary {
  id: number
  name: string
  description: string | null
  htmlUrl: string
  homepage: string | null
  language: string | null
  stars: number
  forks: number
  topics: string[]
  updatedAt: string
}

export interface LanguageStat {
  language: string
  repoCount: number
  percentage: number
}

export type ActivityType = 'push' | 'pull_request' | 'create' | 'issue' | 'release' | 'fork'

export interface ActivityItem {
  id: string
  type: ActivityType
  summary: string
  repoName: string
  repoUrl: string
  url: string | null
  createdAt: string
}

export interface ContributionDay {
  date: string
  count: number
}

export interface ContributionCalendar {
  totalContributions: number
  weeks: ContributionDay[][]
}

export interface GitHubSummary {
  profile: GitHubProfileSummary
  stats: {
    totalStars: number
    totalForks: number
    originalRepoCount: number
    topLanguages: LanguageStat[]
  }
  topRepos: GitHubRepoSummary[]
  /** Real pinned repos, only present when the backend has a token configured. */
  pinnedRepos: GitHubRepoSummary[] | null
  recentActivity: ActivityItem[]
  /** Real contribution calendar, only present when the backend has a token configured. */
  contributionCalendar: ContributionCalendar | null
  fetchedAt: string
  stale: boolean
}
