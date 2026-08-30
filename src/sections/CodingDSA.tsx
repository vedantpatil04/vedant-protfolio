import { Code2 } from 'lucide-react'
import { Section } from '@/components/layout'
import { SectionHeader, EmptyState } from '@/components/ui'
import { Reveal } from '@/components/shared'

export function CodingDSA() {
  return (
    <Section>
      <Reveal>
        <SectionHeader eyebrow="Practice" title="Coding / DSA" />
      </Reveal>
      <div className="mt-10">
        <Reveal delay={0.05}>
          <EmptyState
            icon={Code2}
            title="Not connected yet"
            description="This section will pull real stats once a coding-profile source is wired up."
          />
        </Reveal>
      </div>
    </Section>
  )
}
