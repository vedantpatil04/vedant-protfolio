import { ArrowUpRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Section, AsymmetricLayout } from '@/components/layout'
import { Button } from '@/components/ui'
import { CornerBrackets, Reveal } from '@/components/shared'
import { profile } from '@/data/profile'
import { ROUTES } from '@/constants/routes'
import { STACK_LAYERS } from '@/constants/stack'

/**
 * The page's thesis statement. An asymmetric split pairs the headline
 * with a compact "status panel" — the recurring corner-bracket motif
 * framing real, current information instead of a stat block. Beneath
 * the actions, a small signal strip traces the same request path this
 * site's own architecture follows: interface → service → data.
 */
export function Hero() {
  return (
    <Section compact as="div" className="pt-14 sm:pt-20">
      <AsymmetricLayout
        primary={
          <Reveal>
            <span className="text-label text-accent">Full-stack developer</span>
            <h1 className="text-display mt-4 text-text text-balance">
              {profile.name}
            </h1>
            {profile.tagline && (
              <p className="mt-6 max-w-lg text-body-lg text-text-secondary">{profile.tagline}</p>
            )}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto justify-center">
                <Link to={ROUTES.projects}>
                  View work
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto justify-center">
                <Link to={ROUTES.contact}>Get in touch</Link>
              </Button>
            </div>
            <SignalStrip />
          </Reveal>
        }
        secondary={
          <Reveal delay={0.1}>
            <div className="relative border border-border bg-surface p-6">
              <CornerBrackets />
              <dl className="flex flex-col gap-5">
                <div>
                  <dt className="text-label text-text-tertiary">Role</dt>
                  <dd className="mt-1.5 text-body text-text">{profile.title}</dd>
                </div>
                <div>
                  <dt className="text-label text-text-tertiary">Currently</dt>
                  <dd className="mt-1.5 text-body-sm text-text-secondary">
                    Building full-stack products, end to end
                  </dd>
                </div>
                <div>
                  <dt className="text-label text-text-tertiary">Focus</dt>
                  <dd className="mt-1.5 text-code text-text-secondary">
                    {STACK_LAYERS.map((layer) => layer.label).join(' · ')}
                  </dd>
                </div>
                {profile.location && (
                  <div>
                    <dt className="text-label text-text-tertiary">Location</dt>
                    <dd className="mt-1.5 flex items-center gap-1.5 text-body-sm text-text-secondary">
                      <MapPin className="size-3.5" aria-hidden="true" />
                      {profile.location}
                    </dd>
                  </div>
                )}
                {profile.availability && (
                  <div>
                    <dt className="text-label text-text-tertiary">Status</dt>
                    <dd className="mt-1.5 flex items-center gap-2 text-body-sm text-text">
                      <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                      {profile.availability === 'open-to-work' && 'Open to work'}
                      {profile.availability === 'open-to-freelance' && 'Open to freelance'}
                      {profile.availability === 'not-available' && 'Not currently available'}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </Reveal>
        }
      />
    </Section>
  )
}

/**
 * The hero's one authored visual element. Not decoration — it's a
 * literal trace of the path a request takes through this developer's
 * actual architecture (interface, service, data), each node labeled
 * with what really runs there. Static by default; the connecting line
 * draws in once on load and is skipped under reduced motion.
 */
function SignalStrip() {
  const nodeX = [40, 300, 560]

  return (
    <div className="mt-10 sm:mt-12 max-w-xl" aria-hidden="true">
      {/* Mobile view: readable flow pills */}
      <div className="flex sm:hidden flex-wrap items-center gap-2 py-1">
        {STACK_LAYERS.map((layer, i) => (
          <div key={layer.label} className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded border border-border bg-surface px-2.5 py-1 text-[11px] font-mono text-text-secondary">
              <span className="size-1.5 rounded-full bg-accent" />
              {layer.label.toUpperCase()}
            </span>
            {i < STACK_LAYERS.length - 1 && <span className="text-text-tertiary text-xs">→</span>}
          </div>
        ))}
      </div>

      {/* Desktop / tablet view: svg architecture trace */}
      <div className="hidden sm:block">
        <svg viewBox="0 0 600 54" className="w-full overflow-visible" preserveAspectRatio="xMinYMid meet">
          <line
            x1={nodeX[0]}
            y1={10}
            x2={nodeX[2]}
            y2={10}
            className="stroke-border-strong motion-safe:[stroke-dasharray:520] motion-safe:[stroke-dashoffset:520] motion-safe:animate-[signal-draw_1.1s_var(--ease-out-expo)_0.3s_forwards]"
            strokeWidth={1}
          />
          {STACK_LAYERS.map((layer, i) => (
            <g key={layer.label} transform={`translate(${nodeX[i]}, 10)`}>
              <rect x={-4} y={-4} width={8} height={8} className="fill-bg stroke-accent" strokeWidth={1.25} />
              <text
                x={0}
                y={26}
                textAnchor="middle"
                className="fill-text-tertiary font-mono"
                style={{ fontSize: 10, letterSpacing: '0.08em' }}
              >
                {layer.label.toUpperCase()}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}
