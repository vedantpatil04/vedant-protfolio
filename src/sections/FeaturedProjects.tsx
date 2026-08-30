import { FolderGit2 } from 'lucide-react'
import { Section } from '@/components/layout'
import { SectionHeader, EmptyState } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { projects } from '@/data/profile'

export function FeaturedProjects() {
  const featured = projects.filter((p) => p.featured)

  return (
    <Section>
      <Reveal>
        <SectionHeader eyebrow="Selected work" title="Featured Projects" />
      </Reveal>
      <div className="mt-10">
        {featured.length === 0 ? (
          <Reveal delay={0.05}>
            <EmptyState
              icon={FolderGit2}
              title="Projects are being added"
              description="Featured builds will appear here once project data is connected in Phase 2."
            />
          </Reveal>
        ) : null}
      </div>
    </Section>
  )
}
