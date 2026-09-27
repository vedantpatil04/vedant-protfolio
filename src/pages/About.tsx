import { RefreshCw, GraduationCap, ShieldCheck } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useSkills } from '@/hooks/useSkills'
import { useProjects } from '@/hooks/useProjects'
import { useEducation } from '@/hooks/useEducation'
import { useJourney } from '@/hooks/useJourney'
import { Section } from '@/components/layout'
import { SectionHeader, EmptyState, Button } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { SkillsGrid, SkillsSkeleton } from '@/components/skill'
import { EducationList, EducationSkeleton } from '@/components/education'
import { CurrentFocus } from '@/components/journey'

const ABOUT_INTRO = 'A BCA student building complete, full-stack products — and increasingly, AI-integrated ones.'

const STORY = [
  {
    label: 'What I build',
    body: 'I work across the stack — interfaces in React and TypeScript, services in Node.js and Express, and MongoDB underneath. Recent work includes GreenGuard AI, a full-stack environmental intelligence platform for government and city agencies, and MedFind. This portfolio is built the same way — a real React/Node/MongoDB application, not a template.',
  },
  {
    label: 'Development approach',
    body: 'I build in phases — architecture and data model first, then real features verified end to end, rather than shipping placeholders and filling them in later.',
  },
]

export default function About() {
  usePageTitle('About', ABOUT_INTRO)

  const { skills, loading: skillsLoading, error: skillsError, reload: reloadSkills } = useSkills()
  const { projects } = useProjects()
  const { education, loading: educationLoading, error: educationError, reload: reloadEducation } = useEducation()
  const { entries: focusEntries } = useJourney({ featured: true })

  return (
    <Section compact as="div" className="pt-12 sm:pt-16 lg:pt-20">
      <Reveal>
        <SectionHeader titleAs="h1" eyebrow="Profile" title="About" description={ABOUT_INTRO} />
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-16 sm:mt-20 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col gap-16 lg:col-span-8">
          {STORY.map((block, i) => (
            <Reveal key={block.label} delay={i * 0.05}>
              <div className="grid grid-cols-1 gap-4 border-t border-border pt-6 sm:grid-cols-[10rem_1fr] sm:gap-8">
                <h2 className="text-label flex items-center gap-2.5 text-text-tertiary">
                  <span className="tabular text-accent">{String(i + 1).padStart(2, '0')}</span>
                  {block.label}
                </h2>
                <p className="max-w-[60ch] text-body-lg text-text-secondary">{block.body}</p>
              </div>
            </Reveal>
          ))}

          <Reveal>
            <div id="skills">
              <h2 className="text-h2 text-text">Technical skills</h2>
              <p className="mt-3 max-w-[52ch] text-body text-text-secondary">
                Open a skill to see the published projects that use it. No proficiency percentages — just evidence.
              </p>
              <div className="mt-10">
                {skillsLoading && <SkillsSkeleton />}
                {!skillsLoading && skillsError && (
                  <EmptyState
                    icon={ShieldCheck}
                    title="Couldn't load skills"
                    description={skillsError}
                    action={
                      <Button variant="outline" onClick={reloadSkills}>
                        <RefreshCw className="size-4" aria-hidden="true" />
                        Try again
                      </Button>
                    }
                  />
                )}
                {!skillsLoading && !skillsError && skills.length === 0 && (
                  <EmptyState icon={ShieldCheck} title="No skills published yet." />
                )}
                {!skillsLoading && !skillsError && skills.length > 0 && (
                  <SkillsGrid skills={skills} projects={projects} />
                )}
              </div>
            </div>
          </Reveal>
        </div>

        <aside className="lg:col-span-4">
          <div className="flex flex-col gap-12 lg:sticky lg:top-28">
            {focusEntries.length > 0 && (
              <Reveal delay={0.1}>
                <CurrentFocus entries={focusEntries} />
              </Reveal>
            )}

            <Reveal delay={0.12}>
              <div id="education">
                <h2 className="mb-6 text-h3 text-text">Education</h2>
                {educationLoading && <EducationSkeleton />}
                {!educationLoading && educationError && (
                  <EmptyState
                    icon={GraduationCap}
                    title="Couldn't load education"
                    description={educationError}
                    action={
                      <Button variant="outline" size="sm" onClick={reloadEducation}>
                        <RefreshCw className="size-4" aria-hidden="true" />
                        Try again
                      </Button>
                    }
                  />
                )}
                {!educationLoading && !educationError && education.length === 0 && (
                  <EmptyState icon={GraduationCap} title="No education details available." />
                )}
                {!educationLoading && !educationError && education.length > 0 && (
                  <EducationList education={education} />
                )}
              </div>
            </Reveal>
          </div>
        </aside>
      </div>
    </Section>
  )
}
