import { BookOpen } from 'lucide-react'
import { Section } from '@/components/layout'
import { SectionHeader, EmptyState } from '@/components/ui'
import { Reveal } from '@/components/shared'

export function CaseStudies() {
  return (
    <Section>
      <Reveal>
        <SectionHeader
          eyebrow="Deep dives"
          title="Case Studies"
          description="Longer write-ups on how specific projects were built and the trade-offs behind them."
        />
      </Reveal>
      <div className="mt-10">
        <Reveal delay={0.05}>
          <EmptyState icon={BookOpen} title="No case studies published yet" />
        </Reveal>
      </div>
    </Section>
  )
}
