import { env } from '../config/env'
import { HttpError } from '../utils/http-error'

const GITHUB_API = 'https://api.github.com'
const GITHUB_GRAPHQL = 'https://api.github.com/graphql'

/**
 * Server-side cache TTL. GitHub's unauthenticated REST rate limit is 60
 * requests/hour per IP; since every visitor hits this one cache instead of
 * GitHub directly, an hour-long TTL keeps us far under that regardless of
 * traffic, while activity/star counts stay reasonably current.
 */
const CACHE_TTL_MS = 60 * 60 * 1000

// ---- Shapes returned to the client ----------------------------------

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

export interface ActivityItem {
  id: string
  type: 'push' | 'pull_request' | 'create' | 'issue' | 'release' | 'fork'
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
  /** Real pinned repos from the GraphQL API. Null (never []) when no token is configured — the frontend falls back to topRepos rather than treating an empty pin list as real. */
  pinnedRepos: GitHubRepoSummary[] | null
  recentActivity: ActivityItem[]
  /** Real contribution calendar from the GraphQL API. Null when no token is configured. */
  contributionCalendar: ContributionCalendar | null
  fetchedAt: string
  stale: boolean
}

interface CacheEntry {
  data: GitHubSummary
  fetchedAtMs: number
}

let cache: CacheEntry | null = null
let inFlight: Promise<GitHubSummary> | null = null

async function githubFetch(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      // GitHub's REST API rejects/deprioritizes requests without a UA.
      'User-Agent': 'portfolio-github-activity-section',
      ...(env.githubToken ? { Authorization: `Bearer ${env.githubToken}` } : {}),
    },
  })

  if (!res.ok) {
    const isRateLimit = res.status === 403 && res.headers.get('x-ratelimit-remaining') === '0'
    throw new HttpError(
      res.status === 404 ? 404 : isRateLimit ? 429 : 502,
      isRateLimit ? 'GitHub API rate limit exceeded' : `GitHub API request failed (${res.status})`,
      isRateLimit ? 'RATE_LIMIT_EXCEEDED' : 'GITHUB_API_ERROR',
    )
  }

  return res.json()
}

// ---- REST mapping helpers --------------------------------------------

interface RawRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  topics?: string[]
  pushed_at: string
  fork: boolean
}

function toRepoSummary(repo: RawRepo): GitHubRepoSummary {
  return {
    id: repo.id,
    name: repo.name,
    description: repo.description ?? null,
    htmlUrl: repo.html_url,
    homepage: repo.homepage || null,
    language: repo.language ?? null,
    stars: repo.stargazers_count ?? 0,
    forks: repo.forks_count ?? 0,
    topics: Array.isArray(repo.topics) ? repo.topics : [],
    updatedAt: repo.pushed_at,
  }
}

interface RawEvent {
  id: string
  type: string
  created_at: string
  repo: { name: string; url: string }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any
}

/** Converts the Events API's api.github.com repo URL to a browsable github.com URL. */
function repoHtmlUrl(apiRepoUrl: string): string {
  return apiRepoUrl.replace('api.github.com/repos', 'github.com')
}

/**
 * Normalizes one raw GitHub event into a display-ready activity item, or
 * null if the event type/action isn't interesting enough to surface (e.g.
 * a WatchEvent for starring someone else's repo, or a push with 0 commits).
 */
function describeEvent(event: RawEvent): ActivityItem | null {
  const repoName = event.repo.name
  const repoUrl = repoHtmlUrl(event.repo.url)
  const base = { id: event.id, repoName, repoUrl, createdAt: event.created_at }

  switch (event.type) {
    case 'PushEvent': {
      const count = event.payload?.commits?.length ?? 0
      if (count === 0) return null
      const headSha = event.payload?.head as string | undefined
      return {
        ...base,
        type: 'push',
        summary: `Pushed ${count} commit${count === 1 ? '' : 's'} to ${repoName}`,
        url: headSha ? `${repoUrl}/commit/${headSha}` : repoUrl,
      }
    }
    case 'PullRequestEvent': {
      const action = event.payload?.action as string | undefined
      if (!action || !['opened', 'closed', 'reopened'].includes(action)) return null
      const merged = event.payload?.pull_request?.merged as boolean | undefined
      const verb = merged
        ? 'Merged'
        : action === 'opened'
          ? 'Opened'
          : action === 'reopened'
            ? 'Reopened'
            : 'Closed'
      return {
        ...base,
        type: 'pull_request',
        summary: `${verb} a pull request in ${repoName}`,
        url: event.payload?.pull_request?.html_url ?? repoUrl,
      }
    }
    case 'CreateEvent': {
      const refType = event.payload?.ref_type as string | undefined
      if (refType === 'repository') {
        return { ...base, type: 'create', summary: `Created repository ${repoName}`, url: repoUrl }
      }
      if (refType === 'branch') {
        return { ...base, type: 'create', summary: `Created a new branch in ${repoName}`, url: repoUrl }
      }
      return null
    }
    case 'IssuesEvent': {
      const action = event.payload?.action as string | undefined
      if (!action || !['opened', 'closed', 'reopened'].includes(action)) return null
      const verb = action === 'opened' ? 'Opened' : action === 'reopened' ? 'Reopened' : 'Closed'
      return {
        ...base,
        type: 'issue',
        summary: `${verb} an issue in ${repoName}`,
        url: event.payload?.issue?.html_url ?? repoUrl,
      }
    }
    case 'ReleaseEvent': {
      if (event.payload?.action !== 'published') return null
      return {
        ...base,
        type: 'release',
        summary: `Published a release in ${repoName}`,
        url: event.payload?.release?.html_url ?? repoUrl,
      }
    }
    case 'ForkEvent': {
      return { ...base, type: 'fork', summary: `Forked ${repoName}`, url: repoUrl }
    }
    default:
      return null
  }
}

// ---- GraphQL enrichment (only attempted when a token is configured) --

interface GraphQLEnrichment {
  contributionCalendar: ContributionCalendar | null
  pinnedRepos: GitHubRepoSummary[]
}

async function fetchGraphQLEnrichment(username: string): Promise<GraphQLEnrichment> {
  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
        pinnedItems(first: 6, types: [REPOSITORY]) {
          nodes {
            ... on Repository {
              databaseId
              name
              description
              url
              homepageUrl
              stargazerCount
              forkCount
              pushedAt
              primaryLanguage { name }
              repositoryTopics(first: 5) { nodes { topic { name } } }
            }
          }
        }
      }
    }
  `

  const res = await fetch(GITHUB_GRAPHQL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.githubToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables: { login: username } }),
  })

  if (!res.ok) {
    throw new Error(`GraphQL request failed (${res.status})`)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const json: any = await res.json()

  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message ?? 'GraphQL returned errors')
  }

  const user = json.data?.user
  if (!user) throw new Error('GraphQL returned no user for the configured username')

  const calendar = user.contributionsCollection?.contributionCalendar
  const contributionCalendar: ContributionCalendar | null = calendar
    ? {
        totalContributions: calendar.totalContributions,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        weeks: calendar.weeks.map((week: any) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          week.contributionDays.map((day: any) => ({ date: day.date, count: day.contributionCount })),
        ),
      }
    : null

  const pinnedNodes = user.pinnedItems?.nodes ?? []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pinnedRepos: GitHubRepoSummary[] = pinnedNodes.map((node: any) => ({
    id: node.databaseId,
    name: node.name,
    description: node.description ?? null,
    htmlUrl: node.url,
    homepage: node.homepageUrl || null,
    language: node.primaryLanguage?.name ?? null,
    stars: node.stargazerCount ?? 0,
    forks: node.forkCount ?? 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    topics: (node.repositoryTopics?.nodes ?? []).map((t: any) => t.topic.name),
    updatedAt: node.pushedAt,
  }))

  return { contributionCalendar, pinnedRepos }
}

// ---- Main fetch ---------------------------------------------------------

async function fetchFresh(): Promise<GitHubSummary> {
  const username = env.githubUsername

  const [profileRaw, reposRaw, eventsRaw] = await Promise.all([
    githubFetch(`${GITHUB_API}/users/${username}`),
    githubFetch(`${GITHUB_API}/users/${username}/repos?per_page=100&sort=pushed&direction=desc`),
    // Events can legitimately be empty/unavailable without that being fatal
    // to the rest of the summary — degrade to an empty activity list.
    githubFetch(`${GITHUB_API}/users/${username}/events/public?per_page=30`).catch(() => []),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile = profileRaw as any
  const repos = (Array.isArray(reposRaw) ? reposRaw : []) as RawRepo[]
  const events = (Array.isArray(eventsRaw) ? eventsRaw : []) as RawEvent[]

  const originalRepos = repos.filter((r) => !r.fork)

  const totalStars = originalRepos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0)
  const totalForks = originalRepos.reduce((sum, r) => sum + (r.forks_count ?? 0), 0)

  const languageCounts = new Map<string, number>()
  for (const r of originalRepos) {
    if (!r.language) continue
    languageCounts.set(r.language, (languageCounts.get(r.language) ?? 0) + 1)
  }
  const languagedRepoCount = originalRepos.filter((r) => r.language).length
  const topLanguages: LanguageStat[] = [...languageCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([language, repoCount]) => ({
      language,
      repoCount,
      percentage: languagedRepoCount > 0 ? Math.round((repoCount / languagedRepoCount) * 100) : 0,
    }))

  const topRepos = [...originalRepos]
    .sort(
      (a, b) =>
        (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0) ||
        new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime(),
    )
    .slice(0, 6)
    .map(toRepoSummary)

  const recentActivity = events
    .map(describeEvent)
    .filter((item): item is ActivityItem => item !== null)
    .slice(0, 10)

  let pinnedRepos: GitHubRepoSummary[] | null = null
  let contributionCalendar: ContributionCalendar | null = null

  if (env.githubToken) {
    try {
      const enrichment = await fetchGraphQLEnrichment(username)
      contributionCalendar = enrichment.contributionCalendar
      pinnedRepos = enrichment.pinnedRepos.length > 0 ? enrichment.pinnedRepos : null
    } catch (err) {
      // Token present but GraphQL failed (expired/wrong scope/etc.) — degrade
      // to REST-only data instead of failing the whole summary.
      console.warn(
        '[github.service] GraphQL enrichment failed, falling back to REST-only data:',
        err instanceof Error ? err.message : err,
      )
    }
  }

  return {
    profile: {
      login: profile.login,
      name: profile.name ?? null,
      avatarUrl: profile.avatar_url,
      bio: profile.bio ?? null,
      company: profile.company ?? null,
      location: profile.location ?? null,
      blog: profile.blog || null,
      htmlUrl: profile.html_url,
      followers: profile.followers ?? 0,
      following: profile.following ?? 0,
      publicRepos: profile.public_repos ?? originalRepos.length,
      memberSince: profile.created_at,
    },
    stats: {
      totalStars,
      totalForks,
      originalRepoCount: originalRepos.length,
      topLanguages,
    },
    topRepos,
    pinnedRepos,
    recentActivity,
    contributionCalendar,
    fetchedAt: new Date().toISOString(),
    stale: false,
  }
}

/**
 * Returns the cached GitHub summary, refreshing it in the background once
 * the TTL expires. Concurrent callers during a cold/expired cache share a
 * single in-flight upstream fetch rather than each hitting GitHub. If the
 * refresh fails and a previous snapshot exists, that snapshot is served
 * (flagged `stale`) rather than surfacing an error to every visitor.
 */
export async function getGitHubSummary(): Promise<GitHubSummary> {
  const now = Date.now()

  if (cache && now - cache.fetchedAtMs < CACHE_TTL_MS) {
    return cache.data
  }

  if (inFlight) return inFlight

  inFlight = fetchFresh()
    .then((data) => {
      cache = { data, fetchedAtMs: Date.now() }
      return data
    })
    .catch((err) => {
      if (cache) {
        return { ...cache.data, stale: true }
      }
      throw err
    })
    .finally(() => {
      inFlight = null
    })

  return inFlight
}
