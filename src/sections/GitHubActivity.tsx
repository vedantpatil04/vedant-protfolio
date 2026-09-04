import { Code2, Users, BookMarked, ExternalLink } from 'lucide-react'
import { Section } from '@/components/layout'
import { SectionHeader, EmptyState, Button, Badge } from '@/components/ui'
import { Reveal } from '@/components/shared'
import {
  RepoCard,
  LanguageBar,
  ActivityTimeline,
  ContributionHeatmap,
  GitHubSectionSkeleton,
} from '@/components/github'
import { useGitHubActivity } from '@/hooks/useGitHubActivity'
import { profile } from '@/data/profile'
import { formatDate } from '@/lib/utils'

/**
 * Real GitHub data end to end — nothing here is hardcoded or estimated.
 * Profile stats, repos, languages, and the activity feed come from the
 * public REST API via the server's cached /api/github/summary endpoint.
 * The contribution heatmap and pinned repos only render when the backend
 * has a GITHUB_TOKEN configured (they need the GraphQL API); otherwise
 * those two pieces are simply omitted rather than faked, and starred
 * top repos stand in for "pinned."
 */
export function GitHubActivity() {
  const { summary, loading, error } = useGitHubActivity()

  const showEmpty = !loading && (error || !summary)

  return (
    <Section>
      <Reveal>
        <SectionHeader
          eyebrow="Live"
          title="GitHub Activity"
          action={
            profile.github ? (
              <Button asChild variant="outline" size="sm">
                <a href={profile.github} target="_blank" rel="noreferrer">
                  View profile
                  <ExternalLink className="size-4" aria-hidden="true" />
                </a>
              </Button>
            ) : undefined
          }
        />
      </Reveal>

      <div className="mt-10">
        {loading && (
          <Reveal delay={0.05}>
            <GitHubSectionSkeleton />
          </Reveal>
        )}

        {showEmpty && (
          <Reveal delay={0.05}>
            <EmptyState
              icon={Code2}
              title={error ? 'GitHub activity temporarily unavailable' : "GitHub isn't connected yet"}
              description={
                error
                  ? "Recent commits and repository activity couldn't be loaded right now. You can still view the profile and repositories directly on GitHub."
                  : 'Once linked, recent commits and contribution activity will render here.'
              }
              action={
                profile.github ? (
                  <Button asChild variant="outline" size="sm" className="mt-2">
                    <a href={profile.github} target="_blank" rel="noreferrer">
                      View GitHub profile
                    </a>
                  </Button>
                ) : undefined
              }
            />
          </Reveal>
        )}

        {!loading && !error && summary && (
          <div className="flex flex-col gap-12">
            {/* Profile snapshot */}
            <Reveal delay={0.05}>
              <div className="flex flex-wrap items-center gap-5">
                <img
                  src={summary.profile.avatarUrl}
                  alt={summary.profile.name ?? summary.profile.login}
                  className="size-14 rounded-full border border-border shrink-0"
                />
                <div className="flex flex-1 flex-col gap-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-h3 text-text break-words">
                      {summary.profile.name ?? summary.profile.login}
                    </span>
                    <span className="font-mono text-caption text-text-tertiary">
                      @{summary.profile.login}
                    </span>
                    {summary.stale && (
                      <Badge variant="neutral" className="text-caption">
                        Cached
                      </Badge>
                    )}
                  </div>
                  {summary.profile.bio && (
                    <p className="max-w-xl text-body-sm text-text-secondary">{summary.profile.bio}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-body-sm text-text-secondary">
                  <span className="flex items-center gap-1.5">
                    <Users className="size-4 text-text-tertiary" aria-hidden="true" />
                    {summary.profile.followers} followers
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookMarked className="size-4 text-text-tertiary" aria-hidden="true" />
                    {summary.stats.originalRepoCount} repos
                  </span>
                  <span className="hidden font-mono text-caption text-text-tertiary sm:inline">
                    on GitHub since {formatDate(summary.profile.memberSince, { year: 'numeric' })}
                  </span>
                </div>
              </div>
            </Reveal>

            {/* Stat strip */}
            <Reveal delay={0.08}>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: 'Public repos', value: summary.profile.publicRepos },
                  { label: 'Total stars', value: summary.stats.totalStars },
                  { label: 'Total forks', value: summary.stats.totalForks },
                  { label: 'Followers', value: summary.profile.followers },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-md border border-border p-4">
                    <div className="font-mono text-h3 text-text">{stat.value}</div>
                    <div className="text-caption text-text-tertiary">{stat.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Contribution heatmap — only when the backend has real data (token configured) */}
            {summary.contributionCalendar && (
              <Reveal delay={0.1}>
                <div className="flex flex-col gap-3">
                  <h3 className="text-label text-text-tertiary">Contributions</h3>
                  <ContributionHeatmap calendar={summary.contributionCalendar} />
                </div>
              </Reveal>
            )}

            {/* Languages */}
            {summary.stats.topLanguages.length > 0 && (
              <Reveal delay={0.12}>
                <div className="flex flex-col gap-3">
                  <h3 className="text-label text-text-tertiary">Languages</h3>
                  <LanguageBar languages={summary.stats.topLanguages} />
                </div>
              </Reveal>
            )}

            {/* Pinned repos if real data exists, otherwise top-starred repos as an honest stand-in */}
            <Reveal delay={0.14}>
              <div className="flex flex-col gap-4">
                <h3 className="text-label text-text-tertiary">
                  {summary.pinnedRepos ? 'Pinned repositories' : 'Top repositories'}
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {(summary.pinnedRepos ?? summary.topRepos).map((repo) => (
                    <RepoCard key={repo.id} repo={repo} />
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Recent activity, from GitHub's real public Events API */}
            {summary.recentActivity.length > 0 && (
              <Reveal delay={0.16}>
                <div className="flex flex-col gap-3">
                  <h3 className="text-label text-text-tertiary">Recent activity</h3>
                  <ActivityTimeline items={summary.recentActivity} />
                </div>
              </Reveal>
            )}
          </div>
        )}
      </div>
    </Section>
  )
}
