import { Code2 } from 'lucide-react'
import { Section } from '@/components/layout'
import { SectionHeader, EmptyState } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { profile } from '@/data/profile'
import { Button } from '@/components/ui'

/**
 * Deliberately renders no contribution graph or commit counts until a
 * real GitHub connection exists — a fabricated activity heatmap would
 * violate the "no fake GitHub activity" constraint.
 */
export function GitHubActivity() {
  return (
    <Section>
      <Reveal>
        <SectionHeader eyebrow="Live" title="GitHub Activity" />
      </Reveal>
      <div className="mt-10">
        <Reveal delay={0.05}>
          <EmptyState
            icon={Code2}
            title="GitHub isn't connected yet"
            description="Once linked, recent commits and contribution activity will render here."
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
      </div>
    </Section>
  )
}
