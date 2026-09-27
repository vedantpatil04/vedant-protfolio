import { Link } from 'react-router-dom'
import { ArrowUpRight, GraduationCap } from 'lucide-react'
import { Section } from '@/components/layout'
import { SectionHeader, EmptyState, Button } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { useEducation } from '@/hooks/useEducation'
import { ROUTES } from '@/constants/routes'
import { EducationList, EducationSkeleton } from '@/components/education'

/** Concise: the degree with its aggregate CGPA, then earlier schooling with aligned percentages. */
export function EducationSection() {
  const { education, loading, error } = useEducation()

  return (
    <Section id="education">
      <Reveal>
        <SectionHeader
          index={6}
          eyebrow="Background"
          title="Education"
          action={
            !loading && !error && education.length > 0 ? (
              <Button asChild variant="outline">
                <Link to={`${ROUTES.about}#education`}>
                  More on About
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            ) : undefined
          }
        />
      </Reveal>

      <div className="mt-10 sm:mt-14">
        {loading && <EducationSkeleton />}

        {!loading && (error || education.length === 0) && (
          <Reveal delay={0.05}>
            <EmptyState icon={GraduationCap} title="No education entries added yet" />
          </Reveal>
        )}

        {!loading && !error && education.length > 0 && (
          <Reveal delay={0.05}>
            <EducationList education={education} layout="wide" />
          </Reveal>
        )}
      </div>
    </Section>
  )
}
