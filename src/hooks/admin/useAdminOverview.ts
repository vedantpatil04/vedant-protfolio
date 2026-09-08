import { useEffect, useState } from 'react'
import {
  projectService,
  certificateService,
  achievementService,
  skillService,
  educationService,
  experienceService,
  journeyService,
} from '@/services'

export interface OverviewCounts {
  projects: number
  certificates: number
  achievements: number
  journey: number
  skills: number
  education: number
  experience: number
}

export interface RecentItem {
  id: string
  label: string
  sublabel: string
  updatedAt: string
}

const ZERO_COUNTS: OverviewCounts = {
  projects: 0,
  certificates: 0,
  achievements: 0,
  journey: 0,
  skills: 0,
  education: 0,
  experience: 0,
}

/**
 * Every number here comes from an actual API response — never
 * hardcoded (Phase 8 spec §7/§46). A resource that fails to load
 * just contributes 0 rather than failing the whole overview.
 */
export function useAdminOverview() {
  const [counts, setCounts] = useState<OverviewCounts>(ZERO_COUNTS)
  const [recent, setRecent] = useState<RecentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const [projects, certificates, achievements, skills, education, experience, journey] =
        await Promise.all([
          projectService.listAll().catch(() => []),
          certificateService.listAll().catch(() => []),
          achievementService.listAll().catch(() => []),
          skillService.list().catch(() => []),
          educationService.list().catch(() => []),
          experienceService.list().catch(() => []),
          journeyService.list().catch(() => []),
        ])

      if (cancelled) return

      setCounts({
        projects: projects.length,
        certificates: certificates.length,
        achievements: achievements.length,
        journey: journey.length,
        skills: skills.length,
        education: education.length,
        experience: experience.length,
      })

      const recentItems: RecentItem[] = [
        ...projects.map((p) => ({ id: p.id, label: p.title, sublabel: 'Project', updatedAt: p.updatedAt })),
        ...certificates.map((c) => ({
          id: c.id,
          label: c.title,
          sublabel: 'Certificate',
          updatedAt: c.updatedAt,
        })),
        ...journey.map((j) => ({
          id: j.id,
          label: j.title,
          sublabel: 'Journey entry',
          updatedAt: j.updatedAt,
        })),
      ]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5)

      setRecent(recentItems)
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { counts, recent, loading }
}
