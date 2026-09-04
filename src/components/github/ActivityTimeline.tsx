import type { ComponentType } from 'react'
import { GitCommitHorizontal, GitPullRequest, GitBranch, CircleDot, Tag, GitFork } from 'lucide-react'
import type { ActivityItem, ActivityType } from '@/types'
import { formatRelativeTime } from '@/lib/utils'

const ICONS: Record<ActivityType, ComponentType<{ className?: string }>> = {
  push: GitCommitHorizontal,
  pull_request: GitPullRequest,
  create: GitBranch,
  issue: CircleDot,
  release: Tag,
  fork: GitFork,
}

export interface ActivityTimelineProps {
  items: ActivityItem[]
}

export function ActivityTimeline({ items }: ActivityTimelineProps) {
  if (items.length === 0) return null

  return (
    <ul className="flex flex-col">
      {items.map((item) => {
        const Icon = ICONS[item.type]
        const relative = formatRelativeTime(item.createdAt)
        const content = (
          <>
            <Icon className="size-4 shrink-0 text-text-tertiary" aria-hidden="true" />
            <span className="flex-1 text-body-sm text-text min-w-0 break-words">{item.summary}</span>
            {relative && (
              <span className="shrink-0 font-mono text-caption text-text-tertiary">{relative}</span>
            )}
          </>
        )

        return (
          <li key={item.id} className="border-b border-border py-3.5 last:border-b-0">
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
              >
                {content}
              </a>
            ) : (
              <div className="flex items-center gap-3">{content}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
