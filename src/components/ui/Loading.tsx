import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface LoadingProps {
  label?: string
  className?: string
}

export function Loading({ label = 'Loading', className }: LoadingProps) {
  return (
    <div role="status" className={cn('flex items-center gap-2 text-text-secondary', className)}>
      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      <span className="text-body-sm">{label}</span>
    </div>
  )
}
