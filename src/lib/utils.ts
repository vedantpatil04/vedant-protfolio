import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind class names safely, resolving conflicting utility
 * classes (e.g. "p-2" vs "p-4") in favor of the last one supplied.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats an ISO date string for display (e.g. "Mar 2026"). Returns
 * null for missing/invalid dates rather than rendering "Invalid Date" —
 * callers should treat null as "hide this field", never fabricate one.
 */
export function formatDate(
  value: string | undefined | null,
  options: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' },
): string | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('en-US', options)
}

/**
 * Formats an ISO date string as a short relative label ("3h ago", "5d
 * ago"). Falls back to formatDate's absolute output past ~30 days, and to
 * null for missing/invalid dates — same "hide, don't fabricate" contract
 * as formatDate.
 */
export function formatRelativeTime(value: string | undefined | null): string | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  const diffMs = Date.now() - date.getTime()
  const diffMinutes = Math.round(diffMs / 60_000)
  const diffHours = Math.round(diffMs / 3_600_000)
  const diffDays = Math.round(diffMs / 86_400_000)

  if (diffMinutes < 1) return 'just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 30) return `${diffDays}d ago`
  return formatDate(value)
}
