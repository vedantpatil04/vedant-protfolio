import { Section, EditorialLayout } from '@/components/layout'
import { Reveal } from '@/components/shared'
import { profile } from '@/data/profile'

/**
 * A short, honest intro directly beneath the hero. Deliberately avoids
 * invented years-of-experience or project counts — this is copy, not
 * a stats block.
 */
export function DeveloperSnapshot() {
  return (
    <Section compact>
      <Reveal>
        <EditorialLayout
          meta="profile"
          heading={<h2 className="text-h2 text-text">Snapshot</h2>}
        >
          <p className="text-body-lg text-text-secondary">
            {profile.name} works across the stack — building interfaces in React and
            TypeScript, and the services behind them in Node.js, Express and MongoDB.
            This site is itself a working example: the codebase is structured the same
            way the projects on it are.
          </p>
        </EditorialLayout>
      </Reveal>
    </Section>
  )
}
