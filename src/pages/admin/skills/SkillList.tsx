import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Code2, ArrowUp, ArrowDown } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAdminSkills, useReorder } from '@/hooks/admin'
import { AdminPageHeader, DataTable, ConfirmDialog } from '@/components/admin'
import { Button, IconButton, Select, Skeleton, EmptyState, Badge } from '@/components/ui'
import { ROUTES } from '@/constants/routes'
import { SKILL_CATEGORY_LABELS, SKILL_CATEGORY_ORDER, SKILL_LEVEL_LABELS } from '@/constants/skills'
import type { Skill } from '@/types'

export default function SkillList() {
  usePageTitle('Admin — Skills')
  const { items, loading, error, remove, update, mutating, reload } = useAdminSkills()
  const [category, setCategory] = useState('all')
  const [pendingDelete, setPendingDelete] = useState<Skill | null>(null)

  const filtered = useMemo(
    () => items.filter((s) => category === 'all' || s.category === category),
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
        title="Skills"
        description="Grouped by category on the public Technical Skills section."
        action={
          <Button asChild size="sm">
            <Link to={ROUTES.adminSkillNew}>
              <Plus className="size-4" aria-hidden="true" />
              Add skill
            </Link>
          </Button>
        }
      />

      {items.length > 0 && (
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="max-w-48" aria-label="Filter by category">
          <option value="all">All categories</option>
          {SKILL_CATEGORY_ORDER.map((c) => (
            <option key={c} value={c}>
              {SKILL_CATEGORY_LABELS[c]}
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
          icon={Code2}
          title="No skills yet."
          description="Add your first skill."
          action={
            <Button asChild size="sm">
              <Link to={ROUTES.adminSkillNew}>Add skill</Link>
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <p className="text-body-sm text-text-secondary">No skills match this filter.</p>
      ) : (
        <DataTable<Skill>
          rows={filtered}
          rowKey={(row) => row.id}
          columns={[
            { key: 'name', header: 'Skill', render: (row) => <span className="font-medium text-text">{row.name}</span> },
            { key: 'category', header: 'Category', render: (row) => <Badge>{SKILL_CATEGORY_LABELS[row.category]}</Badge> },
            {
              key: 'level',
              header: 'Level',
              render: (row) => (row.level ? SKILL_LEVEL_LABELS[row.level] : '—'),
            },
          ]}
          actions={(row) => {
            const index = filtered.findIndex((i) => i.id === row.id)
            return (
              <>
                <IconButton
                  size="sm"
                  aria-label={`Move ${row.name} up`}
                  disabled={index <= 0 || mutating}
                  onClick={() => moveItem(index, -1)}
                >
                  <ArrowUp className="size-4" aria-hidden="true" />
                </IconButton>
                <IconButton
                  size="sm"
                  aria-label={`Move ${row.name} down`}
                  disabled={index >= filtered.length - 1 || mutating}
                  onClick={() => moveItem(index, 1)}
                >
                  <ArrowDown className="size-4" aria-hidden="true" />
                </IconButton>
                <IconButton asChild size="sm" aria-label={`Edit ${row.name}`}>
                  <Link to={ROUTES.adminSkillEdit(row.id)}>
                    <Pencil className="size-4" aria-hidden="true" />
                  </Link>
                </IconButton>
                <IconButton size="sm" aria-label={`Delete ${row.name}`} onClick={() => setPendingDelete(row)}>
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
        title={`Delete ${pendingDelete?.name ?? 'this skill'}?`}
        description="This action cannot be undone."
        confirmLabel="Delete skill"
        loading={mutating}
        onConfirm={handleDelete}
      />
    </div>
  )
}
