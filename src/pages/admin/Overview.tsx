import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAdminOverview } from '@/hooks/admin'
import { AdminPageHeader } from '@/components/admin'
import { Card, Button, Skeleton, EmptyState } from '@/components/ui'
import { ADMIN_NAV } from '@/constants/admin-nav'
import { ROUTES } from '@/constants/routes'
import { formatRelativeTime } from '@/lib/utils'

const COUNT_ITEMS = [
  { key: 'projects' as const, label: 'Projects', href: ROUTES.adminProjects },
  { key: 'certificates' as const, label: 'Certificates', href: ROUTES.adminCertificates },
  { key: 'achievements' as const, label: 'Achievements', href: ROUTES.adminAchievements },
  { key: 'journey' as const, label: 'Journey', href: ROUTES.adminJourney },
  { key: 'skills' as const, label: 'Skills', href: ROUTES.adminSkills },
  { key: 'education' as const, label: 'Education', href: ROUTES.adminEducation },
  { key: 'experience' as const, label: 'Experience', href: ROUTES.adminExperience },
]

const QUICK_ACTIONS = [
  { label: 'Add Project', href: ROUTES.adminProjectNew },
  { label: 'Add Certificate', href: ROUTES.adminCertificateNew },
  { label: 'Add Achievement', href: ROUTES.adminAchievementNew },
]

export default function AdminOverview() {
  usePageTitle('Admin Overview')
  const { counts, recent, loading } = useAdminOverview()

  return (
    <div className="flex flex-col gap-10">
      <AdminPageHeader title="Overview" description="A snapshot of your portfolio content." />

      <section>
        <h2 className="text-label text-text-tertiary">Content</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {COUNT_ITEMS.map((item) => {
            const navIcon = ADMIN_NAV.find((n) => n.href === item.href)?.icon
            const Icon = navIcon
            return (
              <Link key={item.key} to={item.href}>
                <Card interactive className="flex flex-col gap-2 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-body-sm text-text-secondary">{item.label}</span>
                    {Icon && <Icon className="size-4 text-text-tertiary" aria-hidden="true" />}
                  </div>
                  {loading ? (
                    <Skeleton className="h-8 w-10" />
                  ) : (
                    <span className="text-h3 text-text">{counts[item.key]}</span>
                  )}
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="text-label text-text-tertiary">Quick actions</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Button key={action.href} asChild variant="secondary" size="sm">
              <Link to={action.href}>
                <Plus className="size-4" aria-hidden="true" />
                {action.label}
              </Link>
            </Button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-label text-text-tertiary">Recently updated</h2>
        <div className="mt-3">
          {loading ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : recent.length === 0 ? (
            <EmptyState title="Nothing updated yet" description="Changes to projects, certificates and journey entries will show up here." />
          ) : (
            <Card className="divide-y divide-border p-0">
              {recent.map((item) => (
                <div key={`${item.sublabel}-${item.id}`} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-body-sm font-medium text-text">{item.label}</p>
                    <p className="text-caption text-text-tertiary">{item.sublabel}</p>
                  </div>
                  <span className="text-caption text-text-tertiary">
                    Updated {formatRelativeTime(item.updatedAt)}
                  </span>
                </div>
              ))}
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}
