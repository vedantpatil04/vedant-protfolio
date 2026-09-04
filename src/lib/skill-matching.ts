import type { Project } from '@/types'

/**
 * Real "used in" evidence for a skill — case-insensitive match against
 * each project's own technologies list. Nothing here is invented: if a
 * skill isn't listed on any published project's technologies, it
 * simply has no results, and callers should render that honestly
 * rather than inventing a relationship.
 */
export function getProjectsForSkill(skillName: string, projects: Project[]): Project[] {
  const needle = skillName.trim().toLowerCase()
  return projects.filter((project) => project.technologies.some((tech) => tech.trim().toLowerCase() === needle))
}
