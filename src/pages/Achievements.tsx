import { Trophy } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { PagePlaceholder } from '@/components/shared'

export default function Achievements() {
  usePageTitle('Achievements')
  return (
    <PagePlaceholder
      eyebrow="Recognition"
      title="Achievements"
      icon={Trophy}
      emptyTitle="No achievements listed yet"
    />
  )
}
