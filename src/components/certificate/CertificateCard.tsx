import { Link } from 'react-router-dom'
import { ArrowUpRight, ShieldCheck } from 'lucide-react'
import type { Certificate } from '@/types'
import { ROUTES } from '@/constants/routes'
import { formatDate, cn } from '@/lib/utils'

export interface CertificateCardProps {
  certificate: Certificate
  /** Larger title — for featured items. */
  large?: boolean
  className?: string
  /** Heading level — h2 on /certificates (under the page h1), h3 inside homepage chapters. */
  titleAs?: 'h2' | 'h3'
}

/**
 * Document-first presentation: the certificate sits on a neutral mat,
 * uncropped (object-contain) and never filtered or recolored. On hover
 * the document lifts a couple of pixels — like picking a page up — and
 * the title takes the accent. Metadata sits below in a clear order:
 * issuer & date, title, category. Used by the /certificates listing and
 * the homepage Certificate Vault preview.
 */
export function CertificateCard({ certificate, large = false, className, titleAs = 'h3' }: CertificateCardProps) {
  const Title = titleAs
  const date = formatDate(certificate.issueDate)

  return (
    <Link
      to={ROUTES.certificateDetail(certificate.id)}
      className={cn(
        'nudge-icons group flex h-full flex-col rounded-md focus-visible:outline-offset-4',
        className,
      )}
    >
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md border border-border bg-surface-2 p-5 transition-colors duration-300 group-hover:border-border-strong sm:p-7">
        {certificate.imageUrl ? (
          <img
            src={certificate.imageUrl}
            alt={`${certificate.title} certificate preview`}
            loading="lazy"
            decoding="async"
            className="max-h-full max-w-full object-contain shadow-[0_1px_2px_hsl(var(--shadow-color)/0.08),0_8px_24px_-12px_hsl(var(--shadow-color)/0.35)] transition-transform duration-500 ease-[var(--ease-out-expo)] motion-safe:group-hover:-translate-y-1"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-text-tertiary">
            <ShieldCheck className="size-7" aria-hidden="true" />
            <span className="text-caption">No preview available</span>
          </div>
        )}
        {certificate.featured && (
          <span className="text-label absolute left-3 top-3 rounded-sm border border-border bg-surface/90 px-2 py-1 text-[0.625rem] text-accent">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="text-label flex flex-wrap items-center gap-x-2 gap-y-1 text-text-tertiary">
          <span className="truncate">{certificate.issuer}</span>
          {date && (
            <>
              <span aria-hidden="true" className="text-border-strong">/</span>
              <span className="tabular">{date}</span>
            </>
          )}
        </p>

        <Title
          className={cn(
            'mt-2 font-display font-bold tracking-[-0.015em] text-text transition-colors duration-200 group-hover:text-accent',
            large ? 'text-h3' : 'text-[1.0625rem] leading-snug',
          )}
        >
          {certificate.title}
        </Title>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          {certificate.category ? (
            <span className="text-caption capitalize text-text-secondary">{certificate.category}</span>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-1 text-caption font-medium text-text-secondary transition-colors group-hover:text-text">
            View
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  )
}
