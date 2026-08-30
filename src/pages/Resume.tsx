import { FileText } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { PagePlaceholder } from '@/components/shared'
import { profile } from '@/data/profile'

export default function Resume() {
  usePageTitle('Resume')
  return (
    <PagePlaceholder
      eyebrow="Download"
      title="Resume"
      icon={FileText}
      emptyTitle={profile.resume ? 'Resume preview coming soon' : 'No resume uploaded yet'}
      emptyDescription={profile.resume ? undefined : 'Add a resume file URL to data/profile.ts to enable this page.'}
    />
  )
}
