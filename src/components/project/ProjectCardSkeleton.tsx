import { Skeleton } from '@/components/ui'

export interface ProjectCardSkeletonProps {
  first?: boolean
}

export function ProjectCardSkeleton({ first = false }: ProjectCardSkeletonProps) {
  return (
    <div className="border-b border-border py-8 sm:py-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[120px_1fr_auto] md:gap-8 items-start">
        <Skeleton className="h-5 w-12" />
        <div className="space-y-3">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-5 w-full max-w-lg" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
        <div className="hidden md:block">
          <Skeleton className="size-10 rounded-full" />
        </div>
      </div>
      {first && (
        <div className="mt-6">
          <Skeleton className="aspect-video max-h-72 w-full rounded-md" />
        </div>
      )}
    </div>
  )
}
