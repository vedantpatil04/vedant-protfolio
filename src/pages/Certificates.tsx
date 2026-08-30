import { ShieldCheck } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { PagePlaceholder } from '@/components/shared'

export default function Certificates() {
  usePageTitle('Certificates')
  return (
    <PagePlaceholder
      eyebrow="Verified"
      title="Certificates"
      icon={ShieldCheck}
      emptyTitle="No certificates added yet"
    />
  )
}
