import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Plus } from 'lucide-react'
import type { Project, Skill } from '@/types'
import { ROUTES } from '@/constants/routes'
import { SKILL_LEVEL_LABELS } from '@/constants/skills'
import { getProjectsForSkill } from '@/lib/skill-matching'
import { DURATION, EASE_OUT_EXPO } from '@/lib/motion'
import { cn } from '@/lib/utils'

export interface SkillItemProps {
  skill: Skill
  projects: Project[]
}

/**
 * A single skill row. Expands (lightweight, inline — no modal/drawer
 * needed) to show real "used in" project evidence instead of a
 * fabricated proficiency percentage. The project count is visible in
 * the collapsed row, so the evidence never hides behind interaction.
 */
export function SkillItem({ skill, projects }: SkillItemProps) {
  const [expanded, setExpanded] = useState(false)
  const panelId = useId()
  const usedIn = getProjectsForSkill(skill.name, projects)

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls={panelId}
        className="group flex min-h-12 w-full items-center justify-between gap-3 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
      >
        <span className="flex min-w-0 flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
          <span className="text-body font-medium text-text transition-colors group-hover:text-accent">{skill.name}</span>
          {skill.level && <span className="text-caption text-text-tertiary">{SKILL_LEVEL_LABELS[skill.level]}</span>}
        </span>
        <span className="flex shrink-0 items-center gap-3">
          {usedIn.length > 0 && (
            <span className="font-mono text-caption tabular text-text-tertiary">
              {usedIn.length} project{usedIn.length === 1 ? '' : 's'}
            </span>
          )}
          <Plus
            className={cn(
              'size-4 text-text-tertiary transition-transform duration-300 ease-[var(--ease-out-expo)]',
              expanded && 'rotate-45 text-text',
            )}
            aria-hidden="true"
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1, transition: { duration: DURATION.medium * 0.7, ease: EASE_OUT_EXPO } }}
            exit={{ height: 0, opacity: 0, transition: { duration: DURATION.fast } }}
            className="overflow-hidden"
          >
            <div className="pb-4">
              {usedIn.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <span className="text-label text-text-tertiary">Used in</span>
                  <ul className="flex flex-col">
                    {usedIn.map((project) => (
                      <li key={project.id}>
                        <Link
                          to={ROUTES.projectDetail(project.slug)}
                          className="nudge-icons group/link inline-flex min-h-9 items-center gap-1.5 text-body-sm text-text-secondary transition-colors hover:text-accent"
                        >
                          <span className="link-underline">{project.title}</span>
                          <ArrowUpRight className="size-3.5" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-caption text-text-tertiary">No linked project yet.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
