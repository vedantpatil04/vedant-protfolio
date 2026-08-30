import { Milestone } from 'lucide-react'
import { Section } from '@/components/layout'
import { SectionHeader, EmptyState } from '@/components/ui'
import { Reveal } from '@/components/shared'

/**
 * Chronological timeline of milestones. Numbered/ordered markers will
 * be appropriate here once real dated entries exist — this is a real
 * sequence, not decoration — but Phase 1 ships the structural shell only.
 */
export function DeveloperJourney() {
  return (
    <Section>
      <Reveal>
        <SectionHeader eyebrow="Timeline" title="Developer Journey" />
      </Reveal>
      <div className="mt-10">
        <Reveal delay={0.05}>
          <EmptyState icon={Milestone} title="Journey timeline coming soon" />
        </Reveal>
      </div>
    </Section>
  )
}
