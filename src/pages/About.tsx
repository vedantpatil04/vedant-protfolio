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

export default function About() {
  usePageTitle('About', ABOUT_INTRO)

  const { skills, loading: skillsLoading, error: skillsError, reload: reloadSkills } = useSkills()
  const { projects } = useProjects()
  const { education, loading: educationLoading, error: educationError, reload: reloadEducation } = useEducation()
  const { entries: focusEntries } = useJourney({ featured: true })

  return (
    <Section compact as="div" className="pt-14 sm:pt-20">
      <Reveal>
        <SectionHeader eyebrow="Profile" title="About" description={ABOUT_INTRO} />
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-14">
          <Reveal delay={0.05}>
            <div className="max-w-2xl">
              <span className="text-label text-text-tertiary">What I build</span>
              <p className="mt-3 text-body-lg text-text-secondary">
                I work across the stack — interfaces in React and TypeScript, services in Node.js and Express,
                and MongoDB underneath. Recent work includes GreenGuard AI, a full-stack environmental
                intelligence platform for government and city agencies, and MedFind. This portfolio is built
                the same way — a real React/Node/MongoDB application, not a template.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="max-w-2xl">
              <span className="text-label text-text-tertiary">Development approach</span>
              <p className="mt-3 text-body-lg text-text-secondary">
                I build in phases — architecture and data model first, then real features verified end to
                end, rather than shipping placeholders and filling them in later.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div id="skills">
              <h2 className="text-h2 text-text">Technical Skills</h2>
              <div className="mt-8">
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

        <div className="flex flex-col gap-10">
          <Reveal delay={0.1}>
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

          {focusEntries.length > 0 && (
            <Reveal delay={0.15}>
              <CurrentFocus entries={focusEntries} />
            </Reveal>
          )}
        </div>
      </div>
    </Section>
  )
}
