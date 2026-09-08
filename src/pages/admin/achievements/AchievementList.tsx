import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Trophy } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAdminAchievements } from '@/hooks/admin'
import { AdminPageHeader, DataTable, ConfirmDialog } from '@/components/admin'
import { Button, IconButton, Input, Select, Skeleton, EmptyState, Switch, Badge } from '@/components/ui'
import { ROUTES } from '@/constants/routes'
import { formatDate } from '@/lib/utils'
import { ACHIEVEMENT_CATEGORIES } from '@/types'
import { ACHIEVEMENT_CATEGORY_LABELS } from '@/constants/content-labels'
import type { Achievement } from '@/types'

export default function AchievementList() {
  usePageTitle('Admin — Achievements')
  const { items, loading, error, update, remove, mutating } = useAdminAchievements()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [pendingDelete, setPendingDelete] = useState<Achievement | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((a) => {
      const matchesSearch = !q || a.title.toLowerCase().includes(q)
      const matchesCategory = category === 'all' || a.category === category
      return matchesSearch && matchesCategory
    })
  }, [items, search, category])

  const handleDelete = async () => {
    if (!pendingDelete) return
    try {
      await remove(pendingDelete.id)
      setPendingDelete(null)
    } catch {
      // Toasted by the hook.
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Achievements"
        description="Hackathons, competitions, awards and publications."
        action={
          <Button asChild size="sm">
            <Link to={ROUTES.adminAchievementNew}>
              <Plus className="size-4" aria-hidden="true" />
              Add achievement
            </Link>
          </Button>
        }
      />

      {items.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Search by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
            aria-label="Search achievements"
          />
          <Select value={category} onChange={(e) => setCategory(e.target.value)} className="max-w-48" aria-label="Filter by category">
            <option value="all">All categories</option>
            {ACHIEVEMENT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {ACHIEVEMENT_CATEGORY_LABELS[c]}
              </option>
            ))}
          </Select>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : error ? (
        <p className="text-body-sm text-red-500">{error}</p>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No achievements yet."
          description="Add your first achievement."
          action={
            <Button asChild size="sm">
              <Link to={ROUTES.adminAchievementNew}>Add achievement</Link>
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <p className="text-body-sm text-text-secondary">No achievements match your filters.</p>
      ) : (
        <DataTable<Achievement>
          rows={filtered}
          rowKey={(row) => row.id}
          columns={[
            {
              key: 'title',
              header: 'Achievement',
              render: (row) => (
                <div>
                  <p className="font-medium text-text">{row.title}</p>
                  {row.organization && <p className="text-caption text-text-tertiary">{row.organization}</p>}
                </div>
              ),
            },
            {
              key: 'category',
              header: 'Category',
              render: (row) => (row.category ? <Badge>{ACHIEVEMENT_CATEGORY_LABELS[row.category]}</Badge> : '—'),
            },
            { key: 'date', header: 'Date', render: (row) => formatDate(row.date) ?? '—' },
            {
              key: 'featured',
              header: 'Featured',
              render: (row) => (
                <Switch
                  aria-label={`Toggle featured for ${row.title}`}
                  checked={row.featured}
                  disabled={mutating}
                  onChange={() => update(row.id, { featured: !row.featured })}
                />
              ),
            },
          ]}
          actions={(row) => (
            <>
              <IconButton asChild size="sm" aria-label={`Edit ${row.title}`}>
                <Link to={ROUTES.adminAchievementEdit(row.id)}>
                  <Pencil className="size-4" aria-hidden="true" />
                </Link>
              </IconButton>
              <IconButton size="sm" aria-label={`Delete ${row.title}`} onClick={() => setPendingDelete(row)}>
                <Trash2 className="size-4" aria-hidden="true" />
              </IconButton>
            </>
          )}
        />
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title={`Delete ${pendingDelete?.title ?? 'this achievement'}?`}
        description="This action cannot be undone."
        confirmLabel="Delete achievement"
        loading={mutating}
        onConfirm={handleDelete}
      />
    </div>
  )
}
