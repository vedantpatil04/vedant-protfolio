import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, FolderKanban } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAdminProjects } from '@/hooks/admin'
import { AdminPageHeader, DataTable, ConfirmDialog, StatusBadge } from '@/components/admin'
import { Button, IconButton, Input, Skeleton, EmptyState, Switch } from '@/components/ui'
import { ROUTES } from '@/constants/routes'
import { formatRelativeTime } from '@/lib/utils'
import type { Project } from '@/types'

export default function ProjectList() {
  usePageTitle('Admin — Projects')
  const { items, loading, error, update, remove, mutating } = useAdminProjects()
  const [search, setSearch] = useState('')
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter((p) => p.title.toLowerCase().includes(q))
  }, [items, search])

  const handleToggleFeatured = (project: Project) => {
    update(project.id, { featured: !project.featured })
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    try {
      await remove(pendingDelete.id)
      setPendingDelete(null)
    } catch {
      // Toasted by the hook — keep the dialog open so the person can retry or cancel.
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Projects"
        description="Everything shown in Projects and Case Studies on the public site."
        action={
          <Button asChild size="sm">
            <Link to={ROUTES.adminProjectNew}>
              <Plus className="size-4" aria-hidden="true" />
              Add project
            </Link>
          </Button>
        }
      />

      {items.length > 0 && (
        <Input
          placeholder="Search by title…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
          aria-label="Search projects"
        />
      )}

      {loading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : error ? (
        <p className="text-body-sm text-red-500">{error}</p>
      ) : items.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet."
          description="Create your first project."
          action={
            <Button asChild size="sm">
              <Link to={ROUTES.adminProjectNew}>Add project</Link>
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <p className="text-body-sm text-text-secondary">No projects match "{search}".</p>
      ) : (
        <DataTable<Project>
          rows={filtered}
          rowKey={(row) => row.id}
          columns={[
            {
              key: 'title',
              header: 'Project',
              render: (row) => (
                <div>
                  <p className="font-medium text-text">{row.title}</p>
                  <p className="text-caption text-text-tertiary">{row.slug}</p>
                </div>
              ),
            },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
            {
              key: 'featured',
              header: 'Featured',
              render: (row) => (
                <Switch
                  aria-label={`Toggle featured for ${row.title}`}
                  checked={row.featured}
                  disabled={mutating}
                  onChange={() => handleToggleFeatured(row)}
                />
              ),
            },
            {
              key: 'updated',
              header: 'Updated',
              render: (row) => <span className="text-text-secondary">{formatRelativeTime(row.updatedAt)}</span>,
            },
          ]}
          actions={(row) => (
            <>
              <IconButton asChild size="sm" aria-label={`Edit ${row.title}`}>
                <Link to={ROUTES.adminProjectEdit(row.id)}>
                  <Pencil className="size-4" aria-hidden="true" />
                </Link>
              </IconButton>
              <IconButton
                size="sm"
                aria-label={`Delete ${row.title}`}
                onClick={() => setPendingDelete(row)}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </IconButton>
            </>
          )}
        />
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title={`Delete ${pendingDelete?.title ?? 'this project'}?`}
        description="This action cannot be undone."
        confirmLabel="Delete project"
        loading={mutating}
        onConfirm={handleDelete}
      />
    </div>
  )
}
