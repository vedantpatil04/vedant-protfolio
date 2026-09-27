import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ruleDraw, revealViewport } from '@/lib/motion'
import { cn } from '@/lib/utils'

export interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
  align?: 'left' | 'center'
  className?: string
  /**
   * Chapter number for the homepage label system ("01 — Selected work").
   * Only pass it where numbering helps orientation (homepage chapters).
   */
  index?: number
  /** Heading level — pages use h1 for their title, homepage chapters h2. */
  titleAs?: 'h1' | 'h2'
  /** Draws the hairline chapter rule above the header. Defaults to on when `index` is set. */
  rule?: boolean
}

/**
 * Standard heading block used at the top of every homepage / page
 * section, so heading rhythm stays consistent site-wide. Numbered
 * chapters get a hairline rule that draws in on first view — the one
 * "border reveal" in the motion vocabulary.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  className,
  index,
  titleAs = 'h2',
  rule,
}: SectionHeaderProps) {
  const Heading = titleAs
  const showRule = rule ?? index !== undefined
  const number = index !== undefined ? String(index).padStart(2, '0') : null

  return (
    <div className={cn('flex flex-col', className)}>
      {showRule && (
        <motion.div
          aria-hidden="true"
          className="mb-7 h-px w-full origin-left bg-border sm:mb-9"
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          variants={ruleDraw}
        />
      )}

      <div
        className={cn(
          'flex flex-col gap-5',
          align === 'left'
            ? 'sm:flex-row sm:items-end sm:justify-between sm:gap-10'
            : 'items-center text-center',
        )}
      >
        <div className={cn('flex min-w-0 flex-col gap-3.5 sm:gap-4', align === 'center' && 'items-center')}>
          {(eyebrow || number) && (
            <span className="text-label flex items-center gap-2.5 text-text-tertiary">
              {number ? (
                <>
                  <span className="text-accent tabular">{number}</span>
                  <span aria-hidden="true" className="h-px w-5 bg-border-strong" />
                  <span>{eyebrow}</span>
                </>
              ) : (
                <span className="text-accent">{eyebrow}</span>
              )}
            </span>
          )}
          <Heading className={cn(titleAs === 'h1' ? 'text-h1' : 'text-h2', 'text-text')}>{title}</Heading>
          {description && (
            <p
              className={cn(
                'max-w-[46ch] text-lead text-text-secondary',
                align === 'center' && 'mx-auto',
              )}
            >
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  )
}
