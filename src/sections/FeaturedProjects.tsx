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
    <Section>
      <Reveal>
        <SectionHeader
          eyebrow="Selected work"
          title="Featured Projects"
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

      <div className="mt-10">
        {loading &&
          [0, 1].map((i) => <ProjectCardSkeleton key={i} first={i === 0} />)}

        {showEmpty && (
          <Reveal delay={0.05}>
            <EmptyState
              icon={FolderGit2}
              title="Projects are being added"
              description="Featured builds will appear here once they're published."
            />
          </Reveal>
        )}

        {!loading &&
          !showEmpty &&
          projects.map((project, i) => (
            <Reveal key={project.id} delay={Math.min(i * 0.05, 0.15)}>
              <ProjectCard project={project} index={i} priority={i === 0} />
            </Reveal>
          ))}
      </div>
    </Section>
  )
}
