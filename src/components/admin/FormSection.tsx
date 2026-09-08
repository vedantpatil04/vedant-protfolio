import type { ReactNode } from 'react'

export interface FormSectionProps {
  title: string
  description?: string
  children: ReactNode
}

/**
 * Groups related fields under a heading (e.g. "Basic Information",
 * "Technology", "Case Study") so long forms like the Project form
 * stay scannable instead of one giant flat list (Phase 8 spec §12/§29).
 */
export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <fieldset className="flex flex-col gap-4 border-t border-border pt-6 first:border-0 first:pt-0">
      <div>
        <legend className="text-body font-medium text-text">{title}</legend>
        {description && <p className="mt-0.5 text-body-sm text-text-secondary">{description}</p>}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  )
}
