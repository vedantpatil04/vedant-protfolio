import { useParams, Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { ArrowLeft, ArrowUpRight, Code2, FileSearch, RefreshCw } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useProject } from '@/hooks/useProject'
import { useProjects } from '@/hooks/useProjects'
import { Section, AsymmetricLayout, EditorialLayout } from '@/components/layout'
import { Button, EmptyState } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { ROUTES } from '@/constants/routes'
import {
  ProjectMeta,
  ProjectImage,
  ProjectGallery,
  TechnologyOverview,
  ArchitectureDiagram,
  NextProjectNav,
  CaseStudySkeleton,
} from '@/components/project'

/** A single case-study section: eyebrow label + heading + narrow-measure body. */
function CaseStudySection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: ReactNode
}) {
  return (
    <Section compact>
      <Reveal>
        <EditorialLayout meta={eyebrow} heading={<h2 className="text-h2 text-text">{title}</h2>}>
          {children}
        </EditorialLayout>
      </Reveal>
    </Section>
  )
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { project, loading, notFound, error, reload } = useProject(slug)
  const { projects: allProjects } = useProjects()

  usePageTitle(project?.title, project?.shortDescription)

  if (loading) return <CaseStudySkeleton />

  if (notFound) {
    return (
      <Section className="flex min-h-[70vh] items-center">
        <Reveal>
          <EmptyState
            icon={FileSearch}
            title={`No project found for "${slug}"`}
            description="It may have been moved or the link is out of date."
            action={
              <Button asChild size="lg">
                <Link to={ROUTES.projects}>
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Back to projects
                </Link>
              </Button>
            }
          />
        </Reveal>
      </Section>
    )
  }

  if (error || !project) {
    return (
      <Section className="flex min-h-[70vh] items-center">
        <Reveal>
          <EmptyState
            icon={FileSearch}
            title="Couldn't load this project"
            description={error ?? undefined}
            action={
              <Button variant="outline" onClick={reload}>
                <RefreshCw className="size-4" aria-hidden="true" />
                Try again
              </Button>
            }
          />
        </Reveal>
      </Section>
    )
  }

  const hasArchitecture = Boolean(project.architecture) || project.technologies.length > 1
  const hasLinks = Boolean(project.githubUrl || project.liveUrl)

  return (
    <>
      {/* Hero + overview */}
      <Section compact as="div" className="pt-14 sm:pt-20">
        <AsymmetricLayout
          primary={
            <Reveal>
              <span className="text-label text-accent">{project.title}</span>
              <h1 className="text-h1 mt-4 text-text text-balance">{project.shortDescription}</h1>
              {project.description && (
                <p className="mt-6 max-w-lg text-body-lg text-text-secondary">{project.description}</p>
              )}
              {project.technologies.length > 0 && (
                <p className="mt-5 text-code text-text-tertiary">
                  {project.technologies.join(' · ')}
                </p>
              )}
              {hasLinks && (
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  {project.liveUrl && (
                    <Button asChild size="lg">
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        Live project
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </a>
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button asChild size="lg" variant="outline">
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Code2 className="size-4" aria-hidden="true" />
                        GitHub
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </Reveal>
          }
          secondary={
            <Reveal delay={0.1}>
              <ProjectMeta project={project} />
            </Reveal>
          }
        />

        {project.thumbnail && (
          <Reveal delay={0.15}>
            <div className="mt-14 sm:mt-16">
              <ProjectImage
                src={project.thumbnail}
                alt={`${project.title} preview`}
                aspect="aspect-video"
                priority
              />
            </div>
          </Reveal>
        )}
      </Section>

      {project.problem && (
        <CaseStudySection eyebrow="The problem" title="What needed to be solved">
          <p className="whitespace-pre-line text-body-lg text-text-secondary">{project.problem}</p>
        </CaseStudySection>
      )}

      {project.solution && (
        <CaseStudySection eyebrow="The solution" title="What was built">
          <p className="whitespace-pre-line text-body-lg text-text-secondary">{project.solution}</p>
        </CaseStudySection>
      )}

      {project.technologies.length > 0 && (
        <CaseStudySection eyebrow="Technology" title="Technical overview">
          <TechnologyOverview technologies={project.technologies} />
        </CaseStudySection>
      )}

      {hasArchitecture && (
        <CaseStudySection eyebrow="Architecture" title="How it's put together">
          <div className="flex flex-col gap-8">
            {project.architecture && (
              <p className="whitespace-pre-line text-body-lg text-text-secondary">
                {project.architecture}
              </p>
            )}
            <ArchitectureDiagram technologies={project.technologies} />
          </div>
        </CaseStudySection>
      )}

      {project.features.length > 0 && (
        <CaseStudySection eyebrow="Key features" title="What it does">
          <ol className="flex flex-col gap-6">
            {project.features.map((feature, i) => (
              <li key={feature} className="flex gap-4">
                <span className="text-label text-accent">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-body-lg text-text-secondary">{feature}</span>
              </li>
            ))}
          </ol>
        </CaseStudySection>
      )}

      {project.challenges.length > 0 && (
        <CaseStudySection eyebrow="Challenges" title="What was difficult">
          <ol className="flex flex-col gap-6">
            {project.challenges.map((challenge, i) => (
              <li key={challenge} className="flex gap-4">
                <span className="text-label text-accent">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-body-lg text-text-secondary">{challenge}</span>
              </li>
            ))}
          </ol>
        </CaseStudySection>
      )}

      {project.outcome && (
        <CaseStudySection eyebrow="Outcome" title="Where it stands">
          <p className="whitespace-pre-line text-body-lg text-text-secondary">{project.outcome}</p>
        </CaseStudySection>
      )}

      {project.gallery.length > 0 && (
        <Section compact>
          <Reveal>
            <span className="text-label text-text-tertiary">Gallery</span>
            <div className="mt-6">
              <ProjectGallery images={project.gallery} projectTitle={project.title} />
            </div>
          </Reveal>
        </Section>
      )}

      {hasLinks && (
        <CaseStudySection eyebrow="Links" title="Where to find it">
          <div className="flex flex-wrap gap-4">
            {project.liveUrl && (
              <Button asChild variant="secondary">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  Live demo
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button asChild variant="secondary">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Code2 className="size-4" aria-hidden="true" />
                  Source on GitHub
                </a>
              </Button>
            )}
          </div>
        </CaseStudySection>
      )}

      <Section compact>
        <NextProjectNav current={project} projects={allProjects} />
      </Section>
    </>
  )
}
