/**
 * Mirrors the backend Skill model (server/src/models/Skill.ts) — kept
 * in sync by hand, same convention as Project/Certificate/Achievement.
 */
export const SKILL_CATEGORIES = ['frontend', 'backend', 'database', 'ai', 'devtools', 'language', 'other'] as const
export type SkillCategory = (typeof SKILL_CATEGORIES)[number]

export const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced'] as const
export type SkillLevel = (typeof SKILL_LEVELS)[number]

export interface Skill {
  id: string
  name: string
  category: SkillCategory
  /** Qualitative only — never rendered as a numeric percentage. */
  level?: SkillLevel
  icon?: string
  order: number
  createdAt: string
  updatedAt: string
}
