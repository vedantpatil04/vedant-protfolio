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
