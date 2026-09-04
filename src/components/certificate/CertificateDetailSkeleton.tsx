import { Section } from '@/components/layout'
import { Skeleton } from '@/components/ui'

export function CertificateDetailSkeleton() {
  return (
    <Section compact as="div" className="pt-14 sm:pt-20">
      <Skeleton className="mb-4 h-4 w-24" />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
        <Skeleton className="aspect-[4/3] w-full rounded-md" />
        <div className="rounded-md border border-border bg-surface p-6">
          <Skeleton className="mb-6 h-8 w-3/4" />
          <Skeleton className="mb-2 h-4 w-1/2" />
          <Skeleton className="mb-6 h-4 w-1/3" />
          <div className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
        </div>
      </div>
    </Section>
  )
}
