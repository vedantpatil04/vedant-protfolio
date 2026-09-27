import { useParams, Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { ArrowLeft, ArrowUpRight, Code2, FileSearch, RefreshCw } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useProject } from '@/hooks/useProject'
import { useProjects } from '@/hooks/useProjects'
import { Section, EditorialLayout } from '@/components/layout'
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

/** A single case-study chapter: numbered meta rail + heading + narrow-measure body. */
function CaseStudySection({
  number,
  eyebrow,
  title,
  children,
}: {
  number: number
  eyebrow: string
  title: string
  children: ReactNode
}) {
  return (
    <Section compact>
      <Reveal>
        <div className="border-t border-border pt-8 sm:pt-10">
          <EditorialLayout
            meta={
              <span className="flex items-center gap-2.5">
                <span className="tabular text-accent">{String(number).padStart(2, '0')}</span>
                <span aria-hidden="true" className="h-px w-4 bg-border-strong" />
                {eyebrow}
              </span>
            }
            heading={<h2 className="text-h2 text-text">{title}</h2>}
          >
            {children}
          </EditorialLayout>
        </div>
      </Reveal>
    </Section>
  )
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="flex flex-col">
      {items.map((entry, i) => (
        <li key={entry} className="flex gap-5 border-b border-border py-5 first:pt-0 last:border-b-0">
          <span className="text-label pt-1.5 tabular text-accent">{String(i + 1).padStart(2, '0')}</span>
          <span className="text-body-lg text-text-secondary">{entry}</span>
        </li>
      ))}
    </ol>
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
        <Reveal className="w-full">
          <EmptyState
            titleAs="h1"
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
        <Reveal className="w-full">
          <EmptyState
            titleAs="h1"
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

  // Chapters are numbered in reading order, counting only the ones this project actually has.
  const chapters: { key: string; eyebrow: string; title: string; body: ReactNode }[] = []
  if (project.problem) {
    chapters.push({
      key: 'problem',
      eyebrow: 'The problem',
      title: 'What needed to be solved',
      body: <p className="whitespace-pre-line text-body-lg text-text-secondary">{project.problem}</p>,
    })
  }
  if (project.solution) {
    chapters.push({
      key: 'solution',
      eyebrow: 'The solution',
      title: 'What was built',
      body: <p className="whitespace-pre-line text-body-lg text-text-secondary">{project.solution}</p>,
    })
  }
  if (project.technologies.length > 0) {
    chapters.push({
      key: 'technology',
      eyebrow: 'Technology',
      title: 'Technical overview',
      body: <TechnologyOverview technologies={project.technologies} />,
    })
  }
  if (hasArchitecture) {
    chapters.push({
      key: 'architecture',
      eyebrow: 'Architecture',
      title: 'How it’s put together',
      body: (
        <div className="flex flex-col gap-8">
          {project.architecture && (
            <p className="whitespace-pre-line text-body-lg text-text-secondary">{project.architecture}</p>
          )}
          <ArchitectureDiagram technologies={project.technologies} />
        </div>
      ),
    })
  }
  if (project.features.length > 0) {
    chapters.push({ key: 'features', eyebrow: 'Key features', title: 'What it does', body: <NumberedList items={project.features} /> })
  }
  if (project.challenges.length > 0) {
    chapters.push({
      key: 'challenges',
      eyebrow: 'Challenges',
      title: 'What was difficult',
      body: <NumberedList items={project.challenges} />,
    })
  }
  if (project.outcome) {
    chapters.push({
      key: 'outcome',
      eyebrow: 'Outcome',
      title: 'Where it stands',
      body: <p className="whitespace-pre-line text-body-lg text-text-secondary">{project.outcome}</p>,
    })
  }

  return (
    <>
      {/* Opening: title, statement, facts */}
      <Section compact as="div" className="pt-8 sm:pt-12 lg:pt-14">
        <Reveal>
          <Link
            to={ROUTES.projects}
            className="nudge-icons inline-flex min-h-11 items-center gap-2 text-body-sm text-text-secondary transition-colors hover:text-text"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span className="link-underline">All work</span>
          </Link>
        </Reveal>

        <div className="mt-6 grid grid-cols-1 gap-12 sm:mt-8 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <span className="text-label flex items-center gap-2.5 text-accent">
              <span aria-hidden="true" className="h-px w-6 bg-accent" />
              Case study
            </span>
            <h1 className="text-h1 mt-5 text-text">{project.title}</h1>
            <p className="mt-6 max-w-[40ch] text-lead text-text">{project.shortDescription}</p>
            {project.description && (
              <p className="mt-5 max-w-[60ch] whitespace-pre-line text-body-lg text-text-secondary">{project.description}</p>
            )}
            {hasLinks && (
              <div className="mt-9 flex flex-col gap-3 xs:flex-row xs:flex-wrap xs:items-center sm:gap-4">
                {project.liveUrl && (
                  <Button asChild size="lg" className="w-full xs:w-auto">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      Live project
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button asChild size="lg" variant="outline" className="w-full xs:w-auto">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Code2 className="size-4" aria-hidden="true" />
                      Source on GitHub
                    </a>
                  </Button>
                )}
              </div>
            )}
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9 lg:pt-12">
            <ProjectMeta project={project} />
          </Reveal>
        </div>

        {project.thumbnail && (
          <Reveal variant="image" className="mt-14 sm:mt-20">
            <ProjectImage
              src={project.thumbnail}
              alt={`${project.title} preview`}
              aspect="aspect-[16/9]"
              priority
            />
          </Reveal>
        )}
      </Section>

      {chapters.map((chapter, i) => (
        <CaseStudySection key={chapter.key} number={i + 1} eyebrow={chapter.eyebrow} title={chapter.title}>
          {chapter.body}
        </CaseStudySection>
      ))}

      {project.gallery.length > 0 && (
        <Section compact>
          <Reveal>
            <div className="flex items-center justify-between border-t border-border pt-8 sm:pt-10">
              <h2 className="text-label text-text-tertiary">Gallery</h2>
              <span className="text-label tabular text-text-tertiary">
                {String(project.gallery.length).padStart(2, '0')} image{project.gallery.length === 1 ? '' : 's'}
              </span>
            </div>
          </Reveal>
          <div className="mt-8">
            <ProjectGallery images={project.gallery} projectTitle={project.title} />
          </div>
        </Section>
      )}

      {hasLinks && (
        <CaseStudySection number={chapters.length + 1} eyebrow="Links" title="Where to find it">
          <div className="flex flex-col gap-3 xs:flex-row xs:flex-wrap sm:gap-4">
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

      <Section compact className="pb-4 sm:pb-8">
        <NextProjectNav current={project} projects={allProjects} />
      </Section>
    </>
  )
}
