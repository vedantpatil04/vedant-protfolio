import { useMemo, useState } from 'react'
import { Mail, Eye, Trash2 } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAdminMessages } from '@/hooks/admin'
import { AdminPageHeader, DataTable, ConfirmDialog } from '@/components/admin'
import { Button, IconButton, Input, Select, Skeleton, EmptyState, Badge, Drawer } from '@/components/ui'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import { MESSAGE_STATUSES } from '@/types'
import type { Message, MessageStatus } from '@/types'

const STATUS_LABELS: Record<MessageStatus, string> = {
  unread: 'Unread',
  read: 'Read',
  archived: 'Archived',
}

const STATUS_BADGE_VARIANT: Record<MessageStatus, 'accent' | 'neutral' | 'outline'> = {
  unread: 'accent',
  read: 'neutral',
  archived: 'outline',
}

export default function MessageList() {
  usePageTitle('Admin — Messages')
  const { items, loading, error, updateStatus, remove, mutating } = useAdminMessages()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | MessageStatus>('all')
  const [active, setActive] = useState<Message | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Message | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items
      .filter((m) => {
        const matchesSearch =
          !q ||
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          (m.subject ?? '').toLowerCase().includes(q)
        const matchesStatus = status === 'all' || m.status === status
        return matchesSearch && matchesStatus
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [items, search, status])

  // Opening a message marks it read — standard inbox behavior. If the
  // update fails the hook already surfaces a toast; the drawer still opens
  // with the message as it was, so the visitor's content is never blocked
  // on that request succeeding.
  const openMessage = async (message: Message) => {
    setActive(message)
    if (message.status !== 'unread') return
    try {
      const updated = await updateStatus(message.id, 'read')
      setActive(updated)
    } catch {
      // Toasted by the hook.
    }
  }

  const handleStatusChange = async (next: MessageStatus) => {
    if (!active) return
    try {
      const updated = await updateStatus(active.id, next)
      setActive(updated)
    } catch {
      // Toasted by the hook.
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    try {
      await remove(pendingDelete.id)
      if (active?.id === pendingDelete.id) setActive(null)
      setPendingDelete(null)
    } catch {
      // Toasted by the hook.
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Messages" description="Contact form submissions from your portfolio." />

      {items.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Search by name, email or subject…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
            aria-label="Search messages"
          />
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'all' | MessageStatus)}
            className="max-w-48"
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            {MESSAGE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
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
          icon={Mail}
          title="No messages yet."
          description="Submissions from your contact form will show up here."
        />
      ) : filtered.length === 0 ? (
        <p className="text-body-sm text-text-secondary">No messages match your filters.</p>
      ) : (
        <DataTable<Message>
          rows={filtered}
          rowKey={(row) => row.id}
          columns={[
            {
              key: 'from',
              header: 'From',
              render: (row) => (
                <button type="button" onClick={() => openMessage(row)} className="flex items-start gap-2 text-left">
                  {row.status === 'unread' && (
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  )}
                  <span>
                    <p className={row.status === 'unread' ? 'font-semibold text-text' : 'font-medium text-text'}>
                      {row.name}
                    </p>
                    <p className="text-caption text-text-tertiary">{row.email}</p>
                  </span>
                </button>
              ),
            },
            {
              key: 'subject',
              header: 'Subject',
              render: (row) => row.subject || <span className="text-text-tertiary">—</span>,
            },
            {
              key: 'status',
              header: 'Status',
              render: (row) => <Badge variant={STATUS_BADGE_VARIANT[row.status]}>{STATUS_LABELS[row.status]}</Badge>,
            },
            {
              key: 'received',
              header: 'Received',
              render: (row) => formatRelativeTime(row.createdAt) ?? '—',
            },
          ]}
          actions={(row) => (
            <>
              <IconButton size="sm" aria-label={`View message from ${row.name}`} onClick={() => openMessage(row)}>
                <Eye className="size-4" aria-hidden="true" />
              </IconButton>
              <IconButton size="sm" aria-label={`Delete message from ${row.name}`} onClick={() => setPendingDelete(row)}>
                <Trash2 className="size-4" aria-hidden="true" />
              </IconButton>
            </>
          )}
        />
      )}

      <Drawer open={!!active} onOpenChange={(open) => !open && setActive(null)} title={active?.subject || 'Message'}>
        {active && (
          <div className="flex flex-1 flex-col gap-5">
            <div className="flex flex-col gap-1">
              <p className="text-body font-medium text-text">{active.name}</p>
              <a href={`mailto:${active.email}`} className="text-body-sm text-accent hover:underline">
                {active.email}
              </a>
              <p className="text-caption text-text-tertiary">
                {formatDate(active.createdAt, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <p className="flex-1 whitespace-pre-wrap text-body-sm text-text">{active.message}</p>

            <div className="flex flex-col gap-3 border-t border-border pt-4">
              <Select
                value={active.status}
                onChange={(e) => handleStatusChange(e.target.value as MessageStatus)}
                disabled={mutating}
                aria-label="Change message status"
              >
                {MESSAGE_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </Select>
              <div className="flex gap-3">
                <Button asChild variant="outline" className="flex-1">
                  <a
                    href={`mailto:${active.email}${
                      active.subject ? `?subject=${encodeURIComponent(`Re: ${active.subject}`)}` : ''
                    }`}
                  >
                    Reply by email
                  </a>
                </Button>
                <Button variant="danger" onClick={() => setPendingDelete(active)}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title={`Delete message from ${pendingDelete?.name ?? 'this visitor'}?`}
        description="This action cannot be undone."
        confirmLabel="Delete message"
        loading={mutating}
        onConfirm={handleDelete}
      />
    </div>
  )
}
