import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import type { Project, Skill } from '@/types'
import { ROUTES } from '@/constants/routes'
import { SKILL_LEVEL_LABELS } from '@/constants/skills'
import { getProjectsForSkill } from '@/lib/skill-matching'
import { cn } from '@/lib/utils'

export interface SkillItemProps {
  skill: Skill
  projects: Project[]
}

/**
 * A single skill row. Expands (lightweight, inline — no modal/drawer
 * needed) to show real "used in" project evidence instead of a
 * fabricated proficiency percentage.
 */
export function SkillItem({ skill, projects }: SkillItemProps) {
  const [expanded, setExpanded] = useState(false)
  const usedIn = getProjectsForSkill(skill.name, projects)

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-3 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
      >
        <span className="flex items-baseline gap-2.5">
          <span className="text-body font-medium text-text">{skill.name}</span>
          {skill.level && <span className="text-caption text-text-tertiary">{SKILL_LEVEL_LABELS[skill.level]}</span>}
        </span>
        <ChevronDown
          className={cn('size-4 shrink-0 text-text-tertiary transition-transform', expanded && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {expanded && (
        <div className="pb-4">
          {usedIn.length > 0 ? (
            <div className="flex flex-col gap-2">
              <span className="text-caption text-text-tertiary">Used in</span>
              <div className="flex flex-wrap gap-2">
                {usedIn.map((project) => (
                  <Link
                    key={project.id}
                    to={ROUTES.projectDetail(project.slug)}
                    className="rounded-sm border border-border px-2.5 py-1 text-caption text-text-secondary transition-colors hover:border-accent hover:text-accent"
                  >
                    {project.title}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-caption text-text-tertiary">No linked project yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
