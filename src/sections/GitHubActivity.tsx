import { Code2, ArrowUpRight } from 'lucide-react'
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
 *
 * Phase 10: presented as part of the portfolio narrative rather than a
 * dashboard — one ledger line of figures instead of stat tiles, and
 * repositories as editorial rows beside languages and recent activity.
 */
export function GitHubActivity() {
  const { summary, loading, error } = useGitHubActivity()

  const showEmpty = !loading && (error || !summary)

  return (
    <Section id="github">
      <Reveal>
        <SectionHeader
          index={7}
          eyebrow="Development activity"
          title="GitHub"
          description="Where the code lives — public repositories and recent work, straight from the GitHub API."
          action={
            profile.github ? (
              <Button asChild variant="outline">
                <a href={profile.github} target="_blank" rel="noreferrer">
                  View profile
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </Button>
            ) : undefined
          }
        />
      </Reveal>

      <div className="mt-10 sm:mt-14">
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
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </a>
                  </Button>
                ) : undefined
              }
            />
          </Reveal>
        )}

        {!loading && !error && summary && (
          <div className="flex flex-col gap-14">
            {/* Profile + ledger */}
            <Reveal>
              <div className="grid grid-cols-1 gap-8 border-t border-border pt-7 lg:grid-cols-12 lg:gap-10">
                <div className="flex items-start gap-4 lg:col-span-5">
                  <img
                    src={summary.profile.avatarUrl}
                    alt=""
                    width={48}
                    height={48}
                    loading="lazy"
                    decoding="async"
                    className="size-12 shrink-0 rounded-full border border-border object-cover"
                  />
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                      <span className="break-words font-display text-h3 text-text">
                        {summary.profile.name ?? summary.profile.login}
                      </span>
                      <span className="font-mono text-caption text-text-tertiary">@{summary.profile.login}</span>
                      {summary.stale && (
                        <Badge variant="neutral" className="text-caption">
                          Cached
                        </Badge>
                      )}
                    </div>
                    {summary.profile.bio && (
                      <p className="max-w-[48ch] text-body-sm text-text-secondary">{summary.profile.bio}</p>
                    )}
                  </div>
                </div>

                <dl className="grid grid-cols-2 gap-y-6 sm:grid-cols-4 lg:col-span-7">
                  {[
                    { label: 'Public repos', value: summary.profile.publicRepos },
                    { label: 'Stars', value: summary.stats.totalStars },
                    { label: 'Forks', value: summary.stats.totalForks },
                    { label: 'Followers', value: summary.profile.followers },
                  ].map((stat) => (
                    <div key={stat.label} className="flex flex-col-reverse gap-1.5 border-l border-border pl-4 sm:pl-5">
                      <dt className="text-label text-text-tertiary">{stat.label}</dt>
                      <dd className="font-display text-[1.75rem] font-extrabold leading-none tracking-[-0.03em] text-text tabular">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              {summary.profile.memberSince && (
                <p className="mt-5 text-caption text-text-tertiary">
                  On GitHub since {formatDate(summary.profile.memberSince, { year: 'numeric' })} ·{' '}
                  {summary.stats.originalRepoCount} original repositor{summary.stats.originalRepoCount === 1 ? 'y' : 'ies'}
                </p>
              )}
            </Reveal>

            {/* Contribution heatmap — only when the backend has real data (token configured) */}
            {summary.contributionCalendar && (
              <Reveal>
                <div className="flex flex-col gap-4">
                  <h3 className="text-label text-text-tertiary">Contributions</h3>
                  <ContributionHeatmap calendar={summary.contributionCalendar} />
                </div>
              </Reveal>
            )}

            <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
              {/* Pinned repos if real data exists, otherwise top-starred repos as an honest stand-in */}
              <Reveal className="lg:col-span-7">
                <h3 className="text-label mb-4 text-text-tertiary">
                  {summary.pinnedRepos ? 'Pinned repositories' : 'Top repositories'}
                </h3>
                <ul>
                  {(summary.pinnedRepos ?? summary.topRepos).map((repo) => (
                    <RepoCard key={repo.id} repo={repo} />
                  ))}
                </ul>
              </Reveal>

              <div className="flex flex-col gap-12 lg:col-span-5">
                {summary.stats.topLanguages.length > 0 && (
                  <Reveal delay={0.05}>
                    <h3 className="text-label mb-4 text-text-tertiary">Languages · by repository</h3>
                    <LanguageBar languages={summary.stats.topLanguages} />
                  </Reveal>
                )}

                {/* Recent activity, from GitHub's real public Events API */}
                {summary.recentActivity.length > 0 && (
                  <Reveal delay={0.1}>
                    <h3 className="text-label mb-2 text-text-tertiary">Recent activity</h3>
                    <ActivityTimeline items={summary.recentActivity} />
                  </Reveal>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Section>
  )
}
