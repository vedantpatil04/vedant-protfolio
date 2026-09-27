import { Skeleton } from '@/components/ui'

/** Mirrors EducationList (primary degree + earlier rows). */
export function EducationSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 border-t border-border pt-6">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-4 h-9 w-full" />
      </div>
      <div className="flex flex-col gap-4 border-t border-border pt-6">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </div>
    </div>
  )
}
