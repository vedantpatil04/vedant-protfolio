import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Braces, Layers, Server, Database, Sparkles, Wrench, Boxes, ArrowUpRight, Code2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { SkillCategory } from '@/types'
import { Section, ThreeColumn } from '@/components/layout'
import { SectionHeader, Tag, Card, Button, EmptyState } from '@/components/ui'
import { Reveal } from '@/components/shared'
import { useSkills } from '@/hooks/useSkills'
import { SKILL_CATEGORY_LABELS, SKILL_CATEGORY_ORDER } from '@/constants/skills'
import { ROUTES } from '@/constants/routes'
import { SkillsSkeleton } from '@/components/skill'

const CATEGORY_ICONS: Record<SkillCategory, LucideIcon> = {
  language: Code2,
  frontend: Layers,
  backend: Server,
  database: Database,
  ai: Sparkles,
  devtools: Wrench,
  other: Boxes,
}

export function TechStack() {
  const { skills, loading } = useSkills()

  const groups = useMemo(() => {
    const map = new Map<SkillCategory, string[]>()
    for (const skill of skills) {
      const list = map.get(skill.category) ?? []
      list.push(skill.name)
      map.set(skill.category, list)
    }
    return SKILL_CATEGORY_ORDER.filter((category) => (map.get(category)?.length ?? 0) > 0).map((category) => ({
      category,
      items: map.get(category) ?? [],
    }))
  }, [skills])

  return (
    <Section>
      <Reveal>
        <SectionHeader
          eyebrow="Toolbox"
          title="Tech Stack"
          action={
            !loading && groups.length > 0 ? (
              <Button asChild variant="outline">
                <Link to={`${ROUTES.about}#skills`}>
                  View full stack
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            ) : undefined
          }
        />
      </Reveal>
      <div className="mt-10">
        {loading && <SkillsSkeleton />}
        {!loading && groups.length === 0 && (
          <Reveal delay={0.05}>
            <EmptyState icon={Braces} title="No skills published yet" />
          </Reveal>
        )}
        {!loading && groups.length > 0 && (
          <ThreeColumn gap="md">
            {groups.map(({ category, items }, i) => {
              const Icon = CATEGORY_ICONS[category] ?? Braces
              return (
                <Reveal key={category} delay={i * 0.05}>
                  <Card>
                    <Icon className="size-5 text-accent" aria-hidden="true" />
                    <h3 className="mt-4 text-h3 text-text">{SKILL_CATEGORY_LABELS[category]}</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {items.map((item) => (
                        <Tag key={item}>{item}</Tag>
                      ))}
                    </div>
                  </Card>
                </Reveal>
              )
            })}
          </ThreeColumn>
        )}
      </div>
    </Section>
  )
}
