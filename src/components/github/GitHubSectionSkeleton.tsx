import { Skeleton } from '@/components/ui'

/** Mirrors the GitHub section: profile + ledger, then repositories beside languages/activity. */
export function GitHubSectionSkeleton() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex items-center gap-4">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-7">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
        <div className="flex flex-col gap-4 lg:col-span-5">
          <Skeleton className="h-1.5 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  )
}
