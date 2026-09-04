import { Code2, ExternalLink, Terminal } from 'lucide-react'
import { Section } from '@/components/layout'
import { SectionHeader, Button, Badge, Card } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { profile } from '@/data/profile'

/**
 * Deliberately stats-free: representations are strictly grounded in real
 * code and verifiable repositories. Java is the primary language for
 * Data Structures & Algorithms solutions (tracked in the public dsa-solutions repo).
 * If a LeetCode profile is configured, a direct link is rendered; otherwise it
 * remains gracefully omitted with zero fake stats or counts.
 */
export function CodingDSA() {
  const dsaRepoUrl = profile.github ? `${profile.github}/dsa-solutions` : undefined

  return (
    <Section>
      <Reveal>
        <SectionHeader
          eyebrow="Practice"
          title="Coding & Problem Solving"
          description="Algorithm practice and data structures implementation grounded in real repository code."
        />
      </Reveal>

      <div className="mt-10">
        <Reveal delay={0.05}>
          <Card className="flex flex-col gap-6 p-4 sm:p-6 md:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className="flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-md border border-border bg-surface-2 text-accent">
                  <Terminal className="size-4 sm:size-5" aria-hidden="true" />
                </div>
                <div className="flex flex-1 flex-col gap-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-h3 text-text">
                      Data Structures & Algorithms
                    </h3>
                    <Badge variant="accent">Java</Badge>
                  </div>
                  <p className="text-body-sm text-text-secondary max-w-2xl">
                    Core problem-solving and algorithmic challenges solved in Java. Solutions, time/space complexity analysis, and pattern implementations are maintained directly in public source repositories.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/60">
              <span className="text-caption text-text-tertiary mr-2">Focus:</span>
              {['Java', 'Data Structures', 'Algorithms', 'Complexity Analysis'].map((topic) => (
                <span
                  key={topic}
                  className="rounded-sm bg-surface-2 px-2 py-0.5 font-mono text-caption text-text-secondary"
                >
                  {topic}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
              {dsaRepoUrl && (
                <Button asChild variant="outline" size="sm" className="w-full sm:w-auto justify-center">
                  <a
                    href={dsaRepoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                  >
                    <Code2 className="size-4" aria-hidden="true" />
                    Browse dsa-solutions (Java)
                    <ExternalLink className="size-3.5 text-text-tertiary" aria-hidden="true" />
                  </a>
                </Button>
              )}

              {profile.leetcode && (
                <Button asChild variant="outline" size="sm" className="w-full sm:w-auto justify-center">
                  <a
                    href={profile.leetcode}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                  >
                    LeetCode Profile
                    <ExternalLink className="size-3.5 text-text-tertiary" aria-hidden="true" />
                  </a>
                </Button>
              )}

              {profile.github && !dsaRepoUrl && (
                <Button asChild variant="outline" size="sm" className="w-full sm:w-auto justify-center">
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                  >
                    Browse GitHub
                    <ExternalLink className="size-3.5 text-text-tertiary" aria-hidden="true" />
                  </a>
                </Button>
              )}
            </div>
          </Card>
        </Reveal>
      </div>
    </Section>
  )
}
