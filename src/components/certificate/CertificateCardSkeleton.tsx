import { Skeleton } from '@/components/ui'

export function CertificateCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-border bg-surface">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-col gap-3 p-5">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="mt-2 flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}
