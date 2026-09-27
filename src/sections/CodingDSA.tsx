import { ArrowUpRight } from 'lucide-react'
import { Section } from '@/components/layout'
import { SectionHeader } from '@/components/ui'
import { CornerBrackets, Reveal } from '@/components/shared'
import { profile } from '@/data/profile'

const FOCUS = ['Data structures', 'Algorithms', 'Complexity analysis']

/**
 * Deliberately stats-free: representations are strictly grounded in real
 * code and verifiable repositories. Java is the primary language for
 * Data Structures & Algorithms solutions (tracked in the public dsa-solutions repo).
 * If a LeetCode profile is configured, a direct link is rendered; otherwise it
 * remains gracefully omitted with zero fake stats or counts.
 *
 * Phase 10: an editorial statement beside a small "spec" panel that
 * states the same facts in a technical register — no counters, streaks,
 * rankings or percentages anywhere.
 */
export function CodingDSA() {
  const dsaRepoUrl = profile.github ? `${profile.github}/dsa-solutions` : undefined

  const links = [
    dsaRepoUrl && { label: 'dsa-solutions', note: 'Java solutions repository', href: dsaRepoUrl },
    profile.leetcode && { label: 'LeetCode', note: 'Practice profile', href: profile.leetcode },
    profile.github && !dsaRepoUrl && { label: 'GitHub', note: 'All repositories', href: profile.github },
  ].filter(Boolean) as { label: string; note: string; href: string }[]

  return (
    <Section id="problem-solving">
      <Reveal>
        <SectionHeader
          index={8}
          eyebrow="Problem solving"
          title="Data Structures & Algorithms"
          description="Algorithm practice and data-structure implementations, grounded in real repository code."
        />
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-12 sm:mt-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-7">
          <p className="max-w-[56ch] text-body-lg text-text-secondary">
            Core problem-solving and algorithmic challenges are solved in <span className="text-text">Java</span>.
            Solutions, time/space complexity analysis and pattern implementations are maintained directly in
            public source repositories — the code is the record.
          </p>

          {links.length > 0 && (
            <ul className="mt-10">
              {links.map((link) => (
                <li key={link.label} className="border-b border-border first:border-t">
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="nudge-icons group flex items-center justify-between gap-6 py-5"
                  >
                    <span className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                      <span className="font-mono text-body font-medium text-text transition-colors group-hover:text-accent">
                        {link.label}
                      </span>
                      <span className="text-body-sm text-text-tertiary">{link.note}</span>
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-text-tertiary group-hover:text-accent" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-5">
          <div className="relative border border-border bg-surface/70 p-5 sm:p-6">
            <CornerBrackets />
            <p className="text-label flex items-center justify-between border-b border-border pb-4 text-text-tertiary">
              <span>dsa.config</span>
              <span className="text-accent">Java</span>
            </p>
            <dl className="mt-1 font-mono text-[0.8125rem] leading-relaxed">
              {[
                { key: 'language', value: 'Java' },
                { key: 'repository', value: dsaRepoUrl ? 'dsa-solutions (public)' : 'Public GitHub repositories' },
                { key: 'focus', value: FOCUS.join(', ') },
                { key: 'record', value: 'Solutions + complexity notes in source' },
              ].map((row) => (
                <div key={row.key} className="grid grid-cols-[6.5rem_1fr] gap-3 border-b border-border py-3 last:border-b-0 last:pb-0">
                  <dt className="text-text-tertiary">{row.key}</dt>
                  <dd className="text-text">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
