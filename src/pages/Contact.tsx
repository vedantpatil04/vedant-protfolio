import { usePageTitle } from '@/hooks/usePageTitle'
import { ContactSection } from '@/sections'

export default function Contact() {
  usePageTitle('Contact')
  return <ContactSection />
}
