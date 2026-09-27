import { Star, GitFork, ArrowUpRight } from 'lucide-react'
import type { GitHubRepoSummary } from '@/types'

export interface RepoCardProps {
  repo: GitHubRepoSummary
}

/**
 * A repository as an editorial row (name, description, facts) rather
 * than a dashboard tile. Every value is straight from the GitHub API
 * summary — including zeros, which are shown as-is rather than hidden
 * or rounded up.
 */
export function RepoCard({ repo }: RepoCardProps) {
  return (
    <li className="border-b border-border first:border-t">
      <a
        href={repo.htmlUrl}
        target="_blank"
        rel="noreferrer"
        className="nudge-icons group grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 py-5 focus-visible:outline-offset-2"
      >
        <h4 className="min-w-0 break-words font-mono text-body font-medium text-text transition-colors group-hover:text-accent">
          {repo.name}
          <span className="sr-only"> (opens GitHub in a new tab)</span>
        </h4>
        <ArrowUpRight className="mt-1 size-4 text-text-tertiary transition-colors group-hover:text-accent" aria-hidden="true" />

        <p className="col-span-2 max-w-[60ch] text-body-sm text-text-secondary line-clamp-2">
          {repo.description ?? 'No description provided.'}
        </p>

        <p className="col-span-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-text-tertiary">
          {repo.language && (
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 bg-accent" aria-hidden="true" />
              {repo.language}
            </span>
          )}
          <span className="inline-flex items-center gap-1 tabular">
            <Star className="size-3.5" aria-hidden="true" />
            {repo.stars}
            <span className="sr-only"> stars</span>
          </span>
          <span className="inline-flex items-center gap-1 tabular">
            <GitFork className="size-3.5" aria-hidden="true" />
            {repo.forks}
            <span className="sr-only"> forks</span>
          </span>
          {repo.topics.slice(0, 3).map((topic) => (
            <span key={topic} className="font-mono">
              #{topic}
            </span>
          ))}
        </p>
      </a>
    </li>
  )
}
