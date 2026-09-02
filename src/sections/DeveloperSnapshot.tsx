import { Section, EditorialLayout } from '@/components/layout'
import { Divider } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { profile } from '@/data/profile'
import { STACK_LAYERS } from '@/constants/stack'

/**
 * A short, honest intro directly beneath the hero. Deliberately avoids
 * invented years-of-experience or project counts — this is copy, not
 * a stats block. The breakdown beneath restates the same real stack
 * from the Hero's signal strip, this time as a plain label/value row
 * rather than a diagram — one visual idea per section.
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

          <Divider className="my-8" />

          <dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3">
            {STACK_LAYERS.map((layer) => (
              <div key={layer.label}>
                <dt className="text-label text-text-tertiary">{layer.label}</dt>
                <dd className="mt-1.5 text-body-sm text-text-secondary">
                  {layer.items.join(' · ')}
                </dd>
              </div>
            ))}
          </dl>
        </EditorialLayout>
      </Reveal>
    </Section>
  )
}
