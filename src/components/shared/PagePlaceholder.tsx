import type { LucideIcon } from 'lucide-react'
import { Section } from '@/components/layout'
import { SectionHeader, EmptyState } from '@/components/ui'
import { Reveal } from './Reveal'

export interface PagePlaceholderProps {
  eyebrow: string
  title: string
  description?: string
  icon: LucideIcon
  emptyTitle: string
  emptyDescription?: string
}

/**
 * Shared shell for routes whose content isn't built out yet in this
 * phase — keeps every "coming soon" route visually and structurally
 * consistent instead of duplicating the same markup per page.
 */
export function PagePlaceholder({
  eyebrow,
  title,
  description,
  icon,
  emptyTitle,
  emptyDescription,
}: PagePlaceholderProps) {
  return (
    <Section className="min-h-[60vh]">
      <Reveal>
        <SectionHeader eyebrow={eyebrow} title={title} description={description} />
      </Reveal>
      <div className="mt-10">
        <Reveal delay={0.05}>
          <EmptyState icon={icon} title={emptyTitle} description={emptyDescription} />
        </Reveal>
      </div>
    </Section>
  )
}
