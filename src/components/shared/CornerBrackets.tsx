import { cn } from '@/lib/utils'

export interface CornerBracketsProps {
  className?: string
  /** Show brackets always, or only reveal them on hover of a parent with `group`. */
  variant?: 'static' | 'group-hover'
}

/**
 * The portfolio's signature motif: four calibration-style corner
 * brackets, borrowed from optical/measurement instruments. Used
 * sparingly — on the hero panel and on interactive surfaces on hover —
 * as the one recurring visual signal instead of drop shadows or glow.
 */
export function CornerBrackets({ className, variant = 'static' }: CornerBracketsProps) {
  const visibility =
    variant === 'group-hover'
      ? 'opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100'
      : ''

  const bracket = 'absolute size-3.5 border-accent'

  return (
    <div className={cn('pointer-events-none absolute inset-0', visibility, className)} aria-hidden="true">
      <span className={cn(bracket, 'left-0 top-0 border-l border-t')} />
      <span className={cn(bracket, 'right-0 top-0 border-r border-t')} />
      <span className={cn(bracket, 'bottom-0 left-0 border-b border-l')} />
      <span className={cn(bracket, 'bottom-0 right-0 border-b border-r')} />
    </div>
  )
}
