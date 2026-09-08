import {
  LayoutDashboard,
  FolderKanban,
  Award,
  Trophy,
  Milestone,
  Code2,
  GraduationCap,
  Briefcase,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import { ROUTES } from './routes'

export interface AdminNavItem {
  label: string
  href: string
  icon: LucideIcon
}

/** Sidebar order for the admin CMS — Phase 8 spec §4. */
export const ADMIN_NAV: AdminNavItem[] = [
  { label: 'Overview', href: ROUTES.admin, icon: LayoutDashboard },
  { label: 'Projects', href: ROUTES.adminProjects, icon: FolderKanban },
  { label: 'Certificates', href: ROUTES.adminCertificates, icon: Award },
  { label: 'Achievements', href: ROUTES.adminAchievements, icon: Trophy },
  { label: 'Journey', href: ROUTES.adminJourney, icon: Milestone },
  { label: 'Skills', href: ROUTES.adminSkills, icon: Code2 },
  { label: 'Education', href: ROUTES.adminEducation, icon: GraduationCap },
  { label: 'Experience', href: ROUTES.adminExperience, icon: Briefcase },
  { label: 'Settings', href: ROUTES.adminSettings, icon: Settings },
]
