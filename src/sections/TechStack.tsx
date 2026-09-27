import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Braces } from 'lucide-react'
import type { Skill, SkillCategory } from '@/types'
import { Section } from '@/components/layout'
import { SectionHeader, Button, EmptyState } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { useSkills } from '@/hooks/useSkills'
import { useProjects } from '@/hooks/useProjects'
import { SKILL_CATEGORY_LABELS, SKILL_CATEGORY_ORDER } from '@/constants/skills'
import { ROUTES } from '@/constants/routes'
import { SkillsSkeleton } from '@/components/skill'
import { getProjectsForSkill } from '@/lib/skill-matching'

/**
 * Technologies grouped by layer, each with real evidence: the small
 * number beside a skill is how many published projects list it in
 * their own technology stack (same matching the About page uses to
 * show "used in" links). Never a proficiency percentage. Skills with
 * no linked project simply show no number.
 */
export function TechStack() {
  const { skills, loading } = useSkills()
  const { projects } = useProjects()

  const groups = useMemo(() => {
    const map = new Map<SkillCategory, Skill[]>()
    for (const skill of skills) {
      const list = map.get(skill.category) ?? []
      list.push(skill)
      map.set(skill.category, list)
    }
    for (const list of map.values()) list.sort((a, b) => a.order - b.order)
    return SKILL_CATEGORY_ORDER.filter((category) => (map.get(category)?.length ?? 0) > 0).map((category) => ({
      category,
      items: (map.get(category) ?? []).map((skill) => ({
        skill,
        usedIn: getProjectsForSkill(skill.name, projects).length,
      })),
    }))
  }, [skills, projects])

  const hasEvidence = groups.some((group) => group.items.some((item) => item.usedIn > 0))

  return (
    <Section id="skills">
      <Reveal>
        <SectionHeader
          index={2}
          eyebrow="Skills"
          title="Tech Stack"
          description="The tools I build with — and where they’re actually used."
          action={
            !loading && groups.length > 0 ? (
              <Button asChild variant="outline">
                <Link to={`${ROUTES.about}#skills`}>
                  See the evidence
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            ) : undefined
          }
        />
      </Reveal>

      <div className="mt-10 sm:mt-14">
        {loading && <SkillsSkeleton />}
        {!loading && groups.length === 0 && (
          <Reveal delay={0.05}>
            <EmptyState icon={Braces} title="No skills published yet" />
          </Reveal>
        )}
        {!loading && groups.length > 0 && (
          <Reveal>
            <dl className="border-b border-border">
              {groups.map(({ category, items }) => (
                <div
                  key={category}
                  className="grid grid-cols-1 gap-3 border-t border-border py-5 sm:py-6 md:grid-cols-12 md:gap-10"
                >
                  <dt className="text-label text-text-tertiary md:col-span-3 md:pt-1.5">
                    {SKILL_CATEGORY_LABELS[category]}
                  </dt>
                  <dd className="md:col-span-9">
                    <ul className="flex flex-wrap gap-x-7 gap-y-2.5">
                      {items.map(({ skill, usedIn }) => (
                        <li key={skill.id} className="flex items-baseline gap-1.5">
                          <span className="font-display text-[1.1875rem] font-semibold tracking-[-0.015em] text-text sm:text-[1.3125rem]">
                            {skill.name}
                          </span>
                          {usedIn > 0 && (
                            <span className="font-mono text-[0.6875rem] tabular text-accent">
                              <span aria-hidden="true">{String(usedIn).padStart(2, '0')}</span>
                              <span className="sr-only">
                                (used in {usedIn} project{usedIn === 1 ? '' : 's'})
                              </span>
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
            {hasEvidence && (
              <p className="mt-5 flex items-center gap-2 text-caption text-text-tertiary">
                <span className="font-mono tabular text-accent">00</span>
                Number of published projects whose stack lists the technology.
              </p>
            )}
          </Reveal>
        )}
      </div>
    </Section>
  )
}
