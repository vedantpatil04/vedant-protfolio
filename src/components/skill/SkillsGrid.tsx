import { useMemo } from 'react'
import type { Project, Skill } from '@/types'
import { SKILL_CATEGORY_ORDER } from '@/constants/skills'
import { SkillCategoryGroup } from './SkillCategoryGroup'

export interface SkillsGridProps {
  skills: Skill[]
  projects: Project[]
}

/** Groups skills by category (in a fixed display order) and lays them out responsively. */
export function SkillsGrid({ skills, projects }: SkillsGridProps) {
  const grouped = useMemo(() => {
    const map = new Map<string, Skill[]>()
    for (const skill of skills) {
      const list = map.get(skill.category) ?? []
      list.push(skill)
      map.set(skill.category, list)
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.order - b.order)
    }
    return map
  }, [skills])

  const categories = SKILL_CATEGORY_ORDER.filter((category) => (grouped.get(category)?.length ?? 0) > 0)

  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <SkillCategoryGroup key={category} category={category} skills={grouped.get(category) ?? []} projects={projects} />
      ))}
    </div>
  )
}
