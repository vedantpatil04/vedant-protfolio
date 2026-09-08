import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Milestone, ArrowUp, ArrowDown } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAdminJourney, useReorder } from '@/hooks/admin'
import { AdminPageHeader, DataTable, ConfirmDialog } from '@/components/admin'
import { Button, IconButton, Select, Skeleton, EmptyState, Switch, Badge } from '@/components/ui'
import { ROUTES } from '@/constants/routes'
import { formatDate } from '@/lib/utils'
import { JOURNEY_CATEGORIES } from '@/types'
import { JOURNEY_CATEGORY_LABELS } from '@/constants/content-labels'
import type { JourneyEntry } from '@/types'

export default function JourneyList() {
  usePageTitle('Admin — Journey')
  const { items, loading, error, update, remove, mutating, reload } = useAdminJourney()
  const [category, setCategory] = useState('all')
  const [pendingDelete, setPendingDelete] = useState<JourneyEntry | null>(null)

  const filtered = useMemo(
    () => items.filter((j) => category === 'all' || j.category === category),
    [items, category],
  )

  const { moveItem } = useReorder(filtered, update, reload)

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
        title="Journey"
        description="Powers the Developer Journey timeline on the public site."
        action={
          <Button asChild size="sm">
            <Link to={ROUTES.adminJourneyNew}>
              <Plus className="size-4" aria-hidden="true" />
              Add entry
            </Link>
          </Button>
        }
      />

      {items.length > 0 && (
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="max-w-48" aria-label="Filter by category">
          <option value="all">All categories</option>
          {JOURNEY_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {JOURNEY_CATEGORY_LABELS[c]}
            </option>
          ))}
        </Select>
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
          icon={Milestone}
          title="No journey entries yet."
          description="Start building your timeline."
          action={
            <Button asChild size="sm">
              <Link to={ROUTES.adminJourneyNew}>Add entry</Link>
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <p className="text-body-sm text-text-secondary">No entries match this filter.</p>
      ) : (
        <DataTable<JourneyEntry>
          rows={filtered}
          rowKey={(row) => row.id}
          columns={[
            {
              key: 'title',
              header: 'Entry',
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
              render: (row) => (row.category ? <Badge>{JOURNEY_CATEGORY_LABELS[row.category]}</Badge> : '—'),
            },
            { key: 'date', header: 'Date', render: (row) => formatDate(row.date) ?? '—' },
            {
              key: 'featured',
              header: 'Current focus',
              render: (row) => (
                <Switch
                  aria-label={`Toggle current focus for ${row.title}`}
                  checked={row.featured}
                  disabled={mutating}
                  onChange={() => update(row.id, { featured: !row.featured })}
                />
              ),
            },
          ]}
          actions={(row) => {
            const index = filtered.findIndex((i) => i.id === row.id)
            return (
              <>
                <IconButton
                  size="sm"
                  aria-label={`Move ${row.title} up`}
                  disabled={index <= 0 || mutating}
                  onClick={() => moveItem(index, -1)}
                >
                  <ArrowUp className="size-4" aria-hidden="true" />
                </IconButton>
                <IconButton
                  size="sm"
                  aria-label={`Move ${row.title} down`}
                  disabled={index >= filtered.length - 1 || mutating}
                  onClick={() => moveItem(index, 1)}
                >
                  <ArrowDown className="size-4" aria-hidden="true" />
                </IconButton>
                <IconButton asChild size="sm" aria-label={`Edit ${row.title}`}>
                  <Link to={ROUTES.adminJourneyEdit(row.id)}>
                    <Pencil className="size-4" aria-hidden="true" />
                  </Link>
                </IconButton>
                <IconButton size="sm" aria-label={`Delete ${row.title}`} onClick={() => setPendingDelete(row)}>
                  <Trash2 className="size-4" aria-hidden="true" />
                </IconButton>
              </>
            )
          }}
        />
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title={`Delete ${pendingDelete?.title ?? 'this entry'}?`}
        description="This action cannot be undone."
        confirmLabel="Delete entry"
        loading={mutating}
        onConfirm={handleDelete}
      />
    </div>
  )
}
