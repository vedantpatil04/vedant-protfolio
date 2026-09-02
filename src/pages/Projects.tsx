import { FolderGit2, RefreshCw } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useProjects } from '@/hooks/useProjects'
import { Section } from '@/components/layout'
import { SectionHeader, EmptyState, Button, Divider } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { ProjectCard, ProjectCardSkeleton } from '@/components/project'

export default function Projects() {
  usePageTitle(
    'Projects',
    'A collection of full-stack systems and products, built end to end.',
  )
  const { projects, loading, error, reload } = useProjects()

  return (
    <Section className="min-h-[70vh]">
      <Reveal>
        <SectionHeader
          eyebrow="Work"
          title="Selected projects"
          description="A collection of systems, products and experiments I've built."
        />
      </Reveal>

      <Divider className="mt-10" />

      <div className="mt-2">
        {loading && (
          <div>
            {[0, 1, 2].map((i) => (
              <ProjectCardSkeleton key={i} first={i === 0} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="py-16">
            <EmptyState
              icon={FolderGit2}
              title="Couldn't load projects"
              description={error}
              action={
                <Button variant="outline" onClick={reload}>
                  <RefreshCw className="size-4" aria-hidden="true" />
                  Try again
                </Button>
              }
            />
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="py-16">
            <EmptyState
              icon={FolderGit2}
              title="No projects added yet"
              description="Published work will appear here."
            />
          </div>
        )}

        {!loading &&
          !error &&
          projects.map((project, i) => (
            <Reveal key={project.id} delay={Math.min(i * 0.05, 0.2)}>
              <ProjectCard project={project} index={i} priority={i === 0} />
            </Reveal>
          ))}
      </div>
    </Section>
  )
}
