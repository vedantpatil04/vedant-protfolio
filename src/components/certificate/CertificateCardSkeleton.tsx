import { Skeleton } from '@/components/ui'

/** Mirrors CertificateCard (document mat + metadata) to avoid layout shift. */
export function CertificateCardSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="flex flex-col gap-2.5 pt-4">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-3/4" />
        <div className="mt-2 flex items-center justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </div>
  )
}
