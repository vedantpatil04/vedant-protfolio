import { ArrowRight, FolderGit2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Section } from '@/components/layout'
import { SectionHeader, EmptyState, Button } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { ProjectCard, ProjectCardSkeleton } from '@/components/project'
import { useProjects } from '@/hooks/useProjects'
import { ROUTES } from '@/constants/routes'

/**
 * Homepage teaser — pulls featured projects from the API rather than
 * hardcoding cards, so this and /projects can never drift apart. A
 * fetch error folds into the same friendly empty state as "nothing
 * published yet" rather than surfacing a raw error on the homepage;
 * the full retry affordance lives on the /projects page itself.
 */
export function FeaturedProjects() {
  const { projects, loading, error } = useProjects({ featured: true })
  const showEmpty = !loading && (error || projects.length === 0)

  return (
    <Section id="work">
      <Reveal>
        <SectionHeader
          index={1}
          eyebrow="Selected work"
          title="Featured Projects"
          description="Products built end to end — from the interface down to the data."
          action={
            <Button asChild variant="outline">
              <Link to={ROUTES.projects}>
                View all work
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          }
        />
      </Reveal>

      <div className="mt-10 sm:mt-14">
        {loading && (
          <div className="border-b border-border">
            {[0, 1].map((i) => (
              <ProjectCardSkeleton key={i} first={i === 0} />
            ))}
          </div>
        )}

        {showEmpty && (
          <Reveal delay={0.05}>
            <EmptyState
              icon={FolderGit2}
              title="Projects are being added"
              description="Featured builds will appear here once they're published."
            />
          </Reveal>
        )}

        {!loading && !showEmpty && (
          <div className="border-b border-border">
            {projects.map((project, i) => (
              <Reveal key={project.id}>
                <ProjectCard project={project} index={i} priority={i === 0} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}
