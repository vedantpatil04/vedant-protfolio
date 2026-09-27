import type { Project } from '@/types'

/**
 * Names the written case-study sections that actually exist for a
 * project (from its real fields) — used to label project rows and to
 * decide whether a project has a case study at all.
 */
export function getCaseStudyChapters(project: Project): string[] {
  const chapters: string[] = []
  if (project.problem) chapters.push('Problem')
  if (project.solution) chapters.push('Solution')
  if (project.architecture) chapters.push('Architecture')
  if (project.features.length > 0) chapters.push('Features')
  if (project.challenges.length > 0) chapters.push('Challenges')
  if (project.outcome) chapters.push('Outcome')
  return chapters
}
