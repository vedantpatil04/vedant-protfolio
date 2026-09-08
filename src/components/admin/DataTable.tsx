import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface DataTableColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  /** Hide this column's table cell below the given breakpoint (still shown in the mobile card). */
  className?: string
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
  actions?: (row: T) => ReactNode
}

/**
 * Shared list layout for every admin resource. Renders a real <table>
 * at sm+ widths and falls back to stacked label/value cards below
 * that — avoids a wide desktop-only table that breaks at 320–430px
 * (see Phase 8 spec §11/§39).
 */
export function DataTable<T>({ columns, rows, rowKey, actions }: DataTableProps<T>) {
  return (
    <>
      {/* Desktop / tablet: real table */}
      <div className="hidden overflow-x-auto rounded-md border border-border sm:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-surface-2/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn('px-4 py-3 text-label text-text-tertiary', col.className)}
                >
                  {col.header}
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-label text-text-tertiary">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)} className="border-b border-border last:border-0 hover:bg-surface-2/40">
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-4 py-3 text-body-sm text-text', col.className)}>
                    {col.render(row)}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">{actions(row)}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {rows.map((row) => (
          <div key={rowKey(row)} className="rounded-md border border-border bg-surface p-4">
            <dl className="flex flex-col gap-2">
              {columns.map((col) => (
                <div key={col.key} className="flex items-center justify-between gap-3">
                  <dt className="text-caption text-text-tertiary">{col.header}</dt>
                  <dd className="text-body-sm text-text">{col.render(row)}</dd>
                </div>
              ))}
            </dl>
            {actions && (
              <div className="mt-3 flex items-center justify-end gap-2 border-t border-border pt-3">
                {actions(row)}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
