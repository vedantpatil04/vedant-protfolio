import { Star, GitFork } from 'lucide-react'
import type { GitHubRepoSummary } from '@/types'
import { Card } from '@/components/ui'
import { languageColor } from './language-color'

export interface RepoCardProps {
  repo: GitHubRepoSummary
}

export function RepoCard({ repo }: RepoCardProps) {
  return (
    <Card interactive className="flex h-full flex-col gap-3 p-5">
      <a
        href={repo.htmlUrl}
        target="_blank"
        rel="noreferrer"
        className="group flex flex-col gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
      >
        <h3 className="font-mono text-body font-medium text-text group-hover:text-accent transition-colors break-words">
          {repo.name}
        </h3>
        <p className="text-body-sm text-text-secondary line-clamp-2">
          {repo.description ?? 'No description provided.'}
        </p>
      </a>

      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="rounded-sm bg-surface-2 px-1.5 py-0.5 text-caption text-text-tertiary"
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center gap-4 pt-1 text-caption text-text-tertiary">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: languageColor(repo.language) }}
              aria-hidden="true"
            />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Star className="size-3.5" aria-hidden="true" />
          {repo.stars}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="size-3.5" aria-hidden="true" />
          {repo.forks}
        </span>
      </div>
    </Card>
  )
}
