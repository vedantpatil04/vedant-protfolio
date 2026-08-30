import { Milestone } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { PagePlaceholder } from '@/components/shared'

export default function Journey() {
  usePageTitle('Journey')
  return (
    <PagePlaceholder
      eyebrow="Timeline"
      title="Developer Journey"
      icon={Milestone}
      emptyTitle="Journey timeline coming soon"
    />
  )
}
