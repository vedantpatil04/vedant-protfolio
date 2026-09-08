import { useState, type KeyboardEvent } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from './Input'

export interface TagInputProps {
  id?: string
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  error?: string
  disabled?: boolean
}

/**
 * Chip-style editor for string[] model fields (technologies, gallery
 * URLs, features, challenges). Enter or comma commits the current
 * input as a tag; backspace on an empty input removes the last one.
 */
export function TagInput({ id, values, onChange, placeholder, error, disabled }: TagInputProps) {
  const [draft, setDraft] = useState('')

  const commit = () => {
    const value = draft.trim()
    if (!value) return
    if (!values.includes(value)) {
      onChange([...values, value])
    }
    setDraft('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      commit()
    } else if (e.key === 'Backspace' && draft === '' && values.length > 0) {
      onChange(values.slice(0, -1))
    }
  }

  const removeAt = (index: number) => {
    onChange(values.filter((_, i) => i !== index))
  }

  return (
    <div
      className={cn(
        'flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5',
        'transition-colors duration-150 ease-out',
        'has-[input:focus]:border-accent hover:border-border-strong',
        error && 'border-red-500/60',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      {values.map((value, index) => (
        <span
          key={`${value}-${index}`}
          className="inline-flex items-center gap-1 rounded-sm bg-surface-2 px-2 py-1 text-caption text-text"
        >
          {value}
          {!disabled && (
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="text-text-tertiary hover:text-text"
              aria-label={`Remove ${value}`}
            >
              <X className="size-3" aria-hidden="true" />
            </button>
          )}
        </span>
      ))}
      <Input
        id={id}
        value={draft}
        disabled={disabled}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder={values.length === 0 ? placeholder : undefined}
        className="h-7 flex-1 border-none bg-transparent p-0 hover:border-none focus:border-none"
      />
    </div>
  )
}
