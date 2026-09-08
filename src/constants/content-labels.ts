import type { AchievementCategory, JourneyCategory, ProjectStatus } from '@/types'

export const ACHIEVEMENT_CATEGORY_LABELS: Record<AchievementCategory, string> = {
  hackathon: 'Hackathon',
  competition: 'Competition',
  award: 'Award',
  publication: 'Publication',
  other: 'Other',
}

export const JOURNEY_CATEGORY_LABELS: Record<JourneyCategory, string> = {
  education: 'Education',
  milestone: 'Milestone',
  project: 'Project',
  focus: 'Focus',
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
}
