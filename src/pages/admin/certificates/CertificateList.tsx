import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Award } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAdminCertificates } from '@/hooks/admin'
import { AdminPageHeader, DataTable, ConfirmDialog } from '@/components/admin'
import { Button, IconButton, Input, Select, Skeleton, EmptyState, Switch, Badge } from '@/components/ui'
import { ROUTES } from '@/constants/routes'
import { formatDate } from '@/lib/utils'
import type { Certificate } from '@/types'

export default function CertificateList() {
  usePageTitle('Admin — Certificates')
  const { items, loading, error, update, remove, mutating } = useAdminCertificates()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [pendingDelete, setPendingDelete] = useState<Certificate | null>(null)

  const categories = useMemo(
    () => Array.from(new Set(items.map((c) => c.category).filter(Boolean))) as string[],
    [items],
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((c) => {
      const matchesSearch = !q || c.title.toLowerCase().includes(q)
      const matchesCategory = category === 'all' || c.category === category
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
        title="Certificates"
        description="Populates the Certificate Vault on the public site."
        action={
          <Button asChild size="sm">
            <Link to={ROUTES.adminCertificateNew}>
              <Plus className="size-4" aria-hidden="true" />
              Add certificate
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
            aria-label="Search certificates"
          />
          {categories.length > 0 && (
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="max-w-48"
              aria-label="Filter by category"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          )}
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
          icon={Award}
          title="No certificates yet."
          description="Add your first certificate."
          action={
            <Button asChild size="sm">
              <Link to={ROUTES.adminCertificateNew}>Add certificate</Link>
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <p className="text-body-sm text-text-secondary">No certificates match your filters.</p>
      ) : (
        <DataTable<Certificate>
          rows={filtered}
          rowKey={(row) => row.id}
          columns={[
            {
              key: 'title',
              header: 'Certificate',
              render: (row) => (
                <div>
                  <p className="font-medium text-text">{row.title}</p>
                  <p className="text-caption text-text-tertiary">{row.issuer}</p>
                </div>
              ),
            },
            {
              key: 'category',
              header: 'Category',
              render: (row) => (row.category ? <Badge>{row.category}</Badge> : <span className="text-text-tertiary">—</span>),
            },
            { key: 'issueDate', header: 'Issued', render: (row) => formatDate(row.issueDate) ?? '—' },
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
                <Link to={ROUTES.adminCertificateEdit(row.id)}>
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
        title={`Delete ${pendingDelete?.title ?? 'this certificate'}?`}
        description="This action cannot be undone."
        confirmLabel="Delete certificate"
        loading={mutating}
        onConfirm={handleDelete}
      />
    </div>
  )
}
