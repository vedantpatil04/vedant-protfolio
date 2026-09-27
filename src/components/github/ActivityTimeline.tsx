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

/** Real public events, newest first — each row links to the event on GitHub when a URL exists. */
export function ActivityTimeline({ items }: ActivityTimelineProps) {
  if (items.length === 0) return null

  return (
    <ul className="flex flex-col">
      {items.map((item) => {
        const Icon = ICONS[item.type]
        const relative = formatRelativeTime(item.createdAt)
        const content = (
          <>
            <Icon className="mt-0.5 size-4 shrink-0 text-text-tertiary transition-colors group-hover:text-accent" aria-hidden="true" />
            <span className="min-w-0 flex-1 break-words text-body-sm text-text">{item.summary}</span>
            {relative && (
              <time dateTime={item.createdAt} className="shrink-0 font-mono text-caption text-text-tertiary tabular">
                {relative}
              </time>
            )}
          </>
        )

        return (
          <li key={item.id} className="border-b border-border last:border-b-0">
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-3 rounded-sm py-3.5 transition-colors hover:text-accent"
              >
                {content}
              </a>
            ) : (
              <div className="flex items-start gap-3 py-3.5">{content}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
