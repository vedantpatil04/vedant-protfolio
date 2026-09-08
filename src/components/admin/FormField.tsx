import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface FormFieldProps {
  id: string
  label: string
  required?: boolean
  helperText?: string
  error?: string
  children: ReactNode
  className?: string
}

/** Consistent label + helper text + error message around every admin form control. */
export function FormField({ id, label, required, helperText, error, children, className }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-label text-text-tertiary">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-caption text-red-500">
          {error}
        </p>
      ) : (
        helperText && <p className="text-caption text-text-tertiary">{helperText}</p>
      )}
    </div>
  )
}
