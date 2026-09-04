import { Link } from 'react-router-dom'
import { ArrowUpRight, ShieldCheck } from 'lucide-react'
import type { Certificate } from '@/types'
import { ROUTES } from '@/constants/routes'
import { Badge } from '@/components/ui'
import { formatDate, cn } from '@/lib/utils'

export interface CertificateCardProps {
  certificate: Certificate
  /** Taller preview + larger type — for featured items in an editorial grid. */
  large?: boolean
  className?: string
}

/**
 * The certificate preview stays the visual focus (object-contain, never
 * cropped) — title/issuer/date/category sit below at a lower visual
 * weight. Used by both the /certificates listing and the homepage
 * Certificate Vault preview.
 */
export function CertificateCard({ certificate, large = false, className }: CertificateCardProps) {
  const date = formatDate(certificate.issueDate)

  return (
    <Link
      to={ROUTES.certificateDetail(certificate.id)}
      className={cn(
        'group flex flex-col overflow-hidden rounded-md border border-border bg-surface transition-colors',
        'hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]',
        className,
      )}
      aria-label={`View certificate: ${certificate.title}`}
    >
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-border bg-surface-2">
        {certificate.imageUrl ? (
          <img
            src={certificate.imageUrl}
            alt={`${certificate.title} certificate preview`}
            loading="lazy"
            className="size-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.015]"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-text-tertiary">
            <ShieldCheck className="size-7" aria-hidden="true" />
            <span className="text-caption">No preview available</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3
            className={cn(
              'font-display text-text transition-colors group-hover:text-accent',
              large ? 'text-h3' : 'text-body font-semibold',
            )}
          >
            {certificate.title}
          </h3>
          {certificate.featured && (
            <Badge variant="accent" className="shrink-0">
              Featured
            </Badge>
          )}
        </div>

        <p className="text-body-sm text-text-secondary">{certificate.issuer}</p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-caption text-text-tertiary">
            {date && <span className="font-mono">{date}</span>}
            {certificate.category && (
              <Badge variant="neutral" className="capitalize">
                {certificate.category}
              </Badge>
            )}
          </div>
          <span className="flex items-center gap-1 text-caption font-medium text-accent">
            View certificate
            <ArrowUpRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </Link>
  )
}
