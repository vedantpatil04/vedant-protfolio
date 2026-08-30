import { ShieldCheck } from 'lucide-react'
import { Section } from '@/components/layout'
import { SectionHeader, EmptyState } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { certificates } from '@/data/profile'

export function CertificateVault() {
  return (
    <Section>
      <Reveal>
        <SectionHeader eyebrow="Verified" title="Certificate Vault" />
      </Reveal>
      <div className="mt-10">
        {certificates.length === 0 && (
          <Reveal delay={0.05}>
            <EmptyState icon={ShieldCheck} title="No certificates added yet" />
          </Reveal>
        )}
      </div>
    </Section>
  )
}
