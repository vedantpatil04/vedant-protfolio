import { Section } from '@/components/layout'
import { Skeleton } from '@/components/ui'

export function CaseStudySkeleton() {
  return (
    <Section compact as="div" className="pt-14 sm:pt-20">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
        {/* Primary header skeleton */}
        <div>
          <Skeleton className="h-4 w-24 mb-4" />
          <Skeleton className="h-10 w-3/4 mb-3" />
          <Skeleton className="h-10 w-1/2 mb-6" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-4/5 mb-6" />
          <Skeleton className="h-4 w-1/3 mb-8" />
          <div className="flex gap-4">
            <Skeleton className="h-11 w-32" />
            <Skeleton className="h-11 w-28" />
          </div>
        </div>

        {/* Secondary meta panel skeleton */}
        <div>
          <div className="rounded-md border border-border bg-surface p-6">
            <Skeleton className="h-4 w-28 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Main image skeleton */}
      <div className="mt-14">
        <Skeleton className="aspect-video w-full rounded-md" />
      </div>

      {/* Body sections skeleton */}
      <div className="mt-16 space-y-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[160px_1fr] lg:gap-16">
          <Skeleton className="h-4 w-20" />
          <div className="space-y-3 max-w-[68ch]">
            <Skeleton className="h-7 w-48 mb-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </Section>
  )
}
