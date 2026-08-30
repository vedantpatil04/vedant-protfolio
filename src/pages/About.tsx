import { UserRound } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { PagePlaceholder } from '@/components/shared'

export default function About() {
  usePageTitle('About')
  return (
    <PagePlaceholder
      eyebrow="Profile"
      title="About"
      description="A longer background, experience and philosophy page — arriving in a later phase."
      icon={UserRound}
      emptyTitle="This page isn't built out yet"
    />
  )
}
