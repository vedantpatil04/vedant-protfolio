import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, GraduationCap, ArrowUp, ArrowDown } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAdminEducation, useReorder } from '@/hooks/admin'
import { AdminPageHeader, DataTable, ConfirmDialog } from '@/components/admin'
import { Button, IconButton, Skeleton, EmptyState } from '@/components/ui'
import { ROUTES } from '@/constants/routes'
import { formatDate } from '@/lib/utils'
import type { Education } from '@/types'

export default function EducationList() {
  usePageTitle('Admin — Education')
  const { items, loading, error, remove, update, mutating, reload } = useAdminEducation()
  const { moveItem } = useReorder(items, update, reload)
  const [pendingDelete, setPendingDelete] = useState<Education | null>(null)

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
        title="Education"
        description="Shown on the public About / Education section."
        action={
          <Button asChild size="sm">
            <Link to={ROUTES.adminEducationNew}>
              <Plus className="size-4" aria-hidden="true" />
              Add education
            </Link>
          </Button>
        }
      />

      {loading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : error ? (
        <p className="text-body-sm text-red-500">{error}</p>
      ) : items.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No education entries yet."
          description="Add your first entry."
          action={
            <Button asChild size="sm">
              <Link to={ROUTES.adminEducationNew}>Add education</Link>
            </Button>
          }
        />
      ) : (
        <DataTable<Education>
          rows={items}
          rowKey={(row) => row.id}
          columns={[
            {
              key: 'institution',
              header: 'Institution',
              render: (row) => (
                <div>
                  <p className="font-medium text-text">{row.institution}</p>
                  <p className="text-caption text-text-tertiary">
                    {row.degree}
                    {row.field ? ` · ${row.field}` : ''}
                  </p>
                </div>
              ),
            },
            {
              key: 'dates',
              header: 'Dates',
              render: (row) => `${formatDate(row.startDate) ?? '—'} – ${row.endDate ? formatDate(row.endDate) : 'Present'}`,
            },
            { key: 'grade', header: 'Grade', render: (row) => row.grade ?? '—' },
          ]}
          actions={(row) => {
            const index = items.findIndex((i) => i.id === row.id)
            return (
              <>
                <IconButton
                  size="sm"
                  aria-label={`Move ${row.institution} up`}
                  disabled={index <= 0 || mutating}
                  onClick={() => moveItem(index, -1)}
                >
                  <ArrowUp className="size-4" aria-hidden="true" />
                </IconButton>
                <IconButton
                  size="sm"
                  aria-label={`Move ${row.institution} down`}
                  disabled={index >= items.length - 1 || mutating}
                  onClick={() => moveItem(index, 1)}
                >
                  <ArrowDown className="size-4" aria-hidden="true" />
                </IconButton>
                <IconButton asChild size="sm" aria-label={`Edit ${row.institution}`}>
                  <Link to={ROUTES.adminEducationEdit(row.id)}>
                    <Pencil className="size-4" aria-hidden="true" />
                  </Link>
                </IconButton>
                <IconButton size="sm" aria-label={`Delete ${row.institution}`} onClick={() => setPendingDelete(row)}>
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
        title={`Delete ${pendingDelete?.institution ?? 'this entry'}?`}
        description="This action cannot be undone."
        confirmLabel="Delete entry"
        loading={mutating}
        onConfirm={handleDelete}
      />
    </div>
  )
}
