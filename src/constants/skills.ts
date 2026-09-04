import type { SkillCategory, SkillLevel } from '@/types'

export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  language: 'Languages',
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  ai: 'AI / Data',
  devtools: 'Tools',
  other: 'Other',
}

/** Display order for category groups (independent of each skill's own `order` within a category). */
export const SKILL_CATEGORY_ORDER: SkillCategory[] = [
  'language',
  'frontend',
  'backend',
  'database',
  'ai',
  'devtools',
  'other',
]

/** Deliberately qualitative — never rendered as a numeric percentage (see Phase 6 spec). */
export const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  advanced: 'Primary',
  intermediate: 'Working knowledge',
  beginner: 'Familiar',
}
