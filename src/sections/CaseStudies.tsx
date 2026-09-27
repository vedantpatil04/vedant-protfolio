import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Section } from '@/components/layout'
import { Reveal } from '@/components/shared'
import { useProjects } from '@/hooks/useProjects'
import { getCaseStudyChapters } from '@/components/project'
import { ROUTES } from '@/constants/routes'

/**
 * Case studies are the written-up projects. The featured ones are
 * already presented (with their chapters) in Selected Work directly
 * above, so this block lists only the *other* projects that have a
 * written case study — a quiet reading index, not a second grid. When
 * there are none it renders nothing rather than an empty placeholder,
 * keeping the homepage from growing without content.
 */
export function CaseStudies() {
  const { projects, loading, error } = useProjects()

  const studies = projects.filter((project) => !project.featured && getCaseStudyChapters(project).length > 0)

  if (loading || error || studies.length === 0) return null

  return (
    <Section compact className="pt-0 sm:pt-0 md:pt-0">
      <Reveal>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-10">
          <h3 className="text-label text-text-tertiary md:col-span-3 md:pt-5">More case studies</h3>
          <ul className="md:col-span-9">
            {studies.map((project) => (
              <li key={project.id} className="border-b border-border first:border-t">
                <Link
                  to={ROUTES.projectDetail(project.slug)}
                  className="nudge-icons group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-5"
                >
                  <span className="font-display text-h3 text-text transition-colors group-hover:text-accent">
                    {project.title}
                  </span>
                  <ArrowRight className="size-4 self-center text-text-tertiary group-hover:text-accent" aria-hidden="true" />
                  <span className="col-span-2 max-w-[60ch] text-body-sm text-text-secondary line-clamp-1">
                    {project.problem ?? project.shortDescription}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  )
}
