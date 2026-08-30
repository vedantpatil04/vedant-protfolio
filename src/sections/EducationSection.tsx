import { GraduationCap } from 'lucide-react'
import { Section } from '@/components/layout'
import { SectionHeader, EmptyState } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { education } from '@/data/profile'

export function EducationSection() {
  return (
    <Section>
      <Reveal>
        <SectionHeader eyebrow="Background" title="Education" />
      </Reveal>
      <div className="mt-10">
        {education.length === 0 && (
          <Reveal delay={0.05}>
            <EmptyState icon={GraduationCap} title="No education entries added yet" />
          </Reveal>
        )}
      </div>
    </Section>
  )
}
