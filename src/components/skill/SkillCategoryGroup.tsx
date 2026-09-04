import type { Project, Skill, SkillCategory } from '@/types'
import { SKILL_CATEGORY_LABELS } from '@/constants/skills'
import { SkillItem } from './SkillItem'

export interface SkillCategoryGroupProps {
  category: SkillCategory
  skills: Skill[]
  projects: Project[]
}

export function SkillCategoryGroup({ category, skills, projects }: SkillCategoryGroupProps) {
  if (skills.length === 0) return null

  return (
    <div>
      <h3 className="text-label text-text-tertiary">{SKILL_CATEGORY_LABELS[category]}</h3>
      <div className="mt-2">
        {skills.map((skill) => (
          <SkillItem key={skill.id} skill={skill} projects={projects} />
        ))}
      </div>
    </div>
  )
}
