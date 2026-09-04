import { Skeleton } from '@/components/ui'

export function EducationSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-md border border-border bg-surface p-6">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="mt-2 h-4 w-1/2" />
        <Skeleton className="mt-5 h-4 w-full" />
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </div>
    </div>
  )
}
