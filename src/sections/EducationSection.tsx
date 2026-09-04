import { Link } from 'react-router-dom'
import { ArrowUpRight, GraduationCap } from 'lucide-react'
import { Section } from '@/components/layout'
import { SectionHeader, EmptyState, Button, Skeleton } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { useEducation } from '@/hooks/useEducation'
import { ROUTES } from '@/constants/routes'

export function EducationSection() {
  const { education, loading, error } = useEducation()
  const primary = education[0]

  return (
    <Section>
      <Reveal>
        <SectionHeader
          eyebrow="Background"
          title="Education"
          action={
            !loading && !error && education.length > 0 ? (
              <Button asChild variant="outline">
                <Link to={`${ROUTES.about}#education`}>
                  View education
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            ) : undefined
          }
        />
      </Reveal>
      <div className="mt-10">
        {loading && (
          <div className="flex max-w-md flex-col gap-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        )}

        {!loading && (error || !primary) && (
          <Reveal delay={0.05}>
            <EmptyState icon={GraduationCap} title="No education entries added yet" />
          </Reveal>
        )}

        {!loading && !error && primary && (
          <Reveal delay={0.05}>
            <div className="max-w-md rounded-md border border-border bg-surface p-6">
              <h3 className="text-h3 text-text text-balance">{primary.degree}</h3>
              <p className="mt-1.5 text-body-sm text-text-secondary">{primary.institution}</p>
              {primary.grade && (
                <p className="mt-3 font-mono text-body-sm text-text-tertiary">Aggregate {primary.grade}</p>
              )}
            </div>
          </Reveal>
        )}
      </div>
    </Section>
  )
}
