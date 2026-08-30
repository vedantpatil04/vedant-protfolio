import { Layers, Server, Database, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Section, ThreeColumn } from '@/components/layout'
import { SectionHeader, Tag, Card } from '@/components/ui'
import { Reveal } from '@/components/shared'

interface StackGroup {
  label: string
  icon: LucideIcon
  items: string[]
}

const STACK_GROUPS: StackGroup[] = [
  { label: 'Frontend', icon: Layers, items: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion'] },
  { label: 'Backend', icon: Server, items: ['Node.js', 'Express', 'TypeScript'] },
  { label: 'Database', icon: Database, items: ['MongoDB', 'Mongoose'] },
  { label: 'Tooling', icon: Wrench, items: ['Git', 'ESLint', 'shadcn/ui'] },
]

export function TechStack() {
  return (
    <Section>
      <Reveal>
        <SectionHeader eyebrow="Toolbox" title="Tech Stack" />
      </Reveal>
      <div className="mt-10">
        <ThreeColumn gap="md">
          {STACK_GROUPS.map((group, i) => (
            <Reveal key={group.label} delay={i * 0.05}>
              <Card>
                <group.icon className="size-5 text-accent" aria-hidden="true" />
                <h3 className="mt-4 text-h3 text-text">{group.label}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </div>
              </Card>
            </Reveal>
          ))}
        </ThreeColumn>
      </div>
    </Section>
  )
}
