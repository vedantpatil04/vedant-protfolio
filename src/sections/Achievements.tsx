import { Trophy } from 'lucide-react'
import { Section } from '@/components/layout'
import { SectionHeader, EmptyState } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { achievements } from '@/data/profile'

export function AchievementsSection() {
  return (
    <Section>
      <Reveal>
        <SectionHeader eyebrow="Recognition" title="Achievements" />
      </Reveal>
      <div className="mt-10">
        {achievements.length === 0 && (
          <Reveal delay={0.05}>
            <EmptyState icon={Trophy} title="No achievements listed yet" />
          </Reveal>
        )}
      </div>
    </Section>
  )
}
