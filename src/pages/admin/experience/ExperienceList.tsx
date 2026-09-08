import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Briefcase, ArrowUp, ArrowDown } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAdminExperience, useReorder } from '@/hooks/admin'
import { AdminPageHeader, DataTable, ConfirmDialog } from '@/components/admin'
import { Button, IconButton, Skeleton, EmptyState } from '@/components/ui'
import { ROUTES } from '@/constants/routes'
import { formatDate } from '@/lib/utils'
import type { Experience } from '@/types'

export default function ExperienceList() {
  usePageTitle('Admin — Experience')
  const { items, loading, error, remove, update, mutating, reload } = useAdminExperience()
  const { moveItem } = useReorder(items, update, reload)
  const [pendingDelete, setPendingDelete] = useState<Experience | null>(null)

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
        title="Experience"
        description="Professional experience — safe to leave empty until there's a real entry."
        action={
          <Button asChild size="sm">
            <Link to={ROUTES.adminExperienceNew}>
              <Plus className="size-4" aria-hidden="true" />
              Add experience
            </Link>
          </Button>
        }
      />

      {loading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 w-full" />
        </div>
      ) : error ? (
        <p className="text-body-sm text-red-500">{error}</p>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No experience entries yet."
          description="Add an entry once you have one to show."
          action={
            <Button asChild size="sm">
              <Link to={ROUTES.adminExperienceNew}>Add experience</Link>
            </Button>
          }
        />
      ) : (
        <DataTable<Experience>
          rows={items}
          rowKey={(row) => row.id}
          columns={[
            {
              key: 'organization',
              header: 'Organization',
              render: (row) => (
                <div>
                  <p className="font-medium text-text">{row.organization}</p>
                  <p className="text-caption text-text-tertiary">{row.role}</p>
                </div>
              ),
            },
            {
              key: 'dates',
              header: 'Dates',
              render: (row) => `${formatDate(row.startDate) ?? '—'} – ${row.endDate ? formatDate(row.endDate) : 'Present'}`,
            },
          ]}
          actions={(row) => {
            const index = items.findIndex((i) => i.id === row.id)
            return (
              <>
                <IconButton
                  size="sm"
                  aria-label={`Move ${row.organization} up`}
                  disabled={index <= 0 || mutating}
                  onClick={() => moveItem(index, -1)}
                >
                  <ArrowUp className="size-4" aria-hidden="true" />
                </IconButton>
                <IconButton
                  size="sm"
                  aria-label={`Move ${row.organization} down`}
                  disabled={index >= items.length - 1 || mutating}
                  onClick={() => moveItem(index, 1)}
                >
                  <ArrowDown className="size-4" aria-hidden="true" />
                </IconButton>
                <IconButton asChild size="sm" aria-label={`Edit ${row.organization}`}>
                  <Link to={ROUTES.adminExperienceEdit(row.id)}>
                    <Pencil className="size-4" aria-hidden="true" />
                  </Link>
                </IconButton>
                <IconButton size="sm" aria-label={`Delete ${row.organization}`} onClick={() => setPendingDelete(row)}>
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
        title={`Delete ${pendingDelete?.organization ?? 'this entry'}?`}
        description="This action cannot be undone."
        confirmLabel="Delete entry"
        loading={mutating}
        onConfirm={handleDelete}
      />
    </div>
  )
}
