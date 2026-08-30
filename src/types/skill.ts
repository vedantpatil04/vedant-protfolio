export type SkillCategory = 'frontend' | 'backend' | 'database' | 'devtools' | 'language' | 'other'

export interface Skill {
  id: string
  name: string
  category: SkillCategory
  icon?: string
  /** 1–5, optional — omit rather than inventing a number. */
  proficiency?: number
}
