import { Fragment } from 'react'
import { ArrowDown, ArrowUpRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import { Section } from '@/components/layout'
import { Button } from '@/components/ui'
import { CornerBrackets } from '@/components/shared'
import { useIntro } from '@/hooks/useIntro'
import { profile } from '@/data/profile'
import { ROUTES } from '@/constants/routes'
import { STACK_LAYERS } from '@/constants/stack'
import { DURATION, EASE_OUT_EXPO, fadeUp, maskUp, ruleDraw, staggerContainer } from '@/lib/motion'

/**
 * Real, current information only — no statistics, activity or claims.
 * "Current focus" and "Building" restate what the portfolio itself
 * demonstrates (full-stack apps, AI integration, Java DSA practice).
 */
const PANEL_ROWS: { label: string; value: string; mono?: boolean }[] = [
  { label: 'Role', value: profile.title },
  { label: 'Current focus', value: 'Full-Stack · AI · DSA', mono: true },
  { label: 'Building', value: 'Web applications and systems' },
]

const panelRow: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.medium, ease: EASE_OUT_EXPO } },
}

/**
 * The page's thesis statement, refined for Phase 10. The name is set at
 * display scale and revealed line-by-line from a mask — the same
 * composition the multilingual intro resolves into, so the intro's
 * final frame hands off to the Hero rather than cutting to it. The
 * entrance is held while the intro overlay is up and starts as it lifts.
 *
 * Beside the actions sits the "system panel" (the corner-bracket motif
 * framing real profile facts). The signal strip along the bottom rail
 * traces this site's own request path: interface → service → data.
 */
export function Hero() {
  const { phase } = useIntro()
  const ready = phase !== 'playing'
  const [firstName, ...rest] = profile.name.split(' ')
  const lastName = rest.join(' ')

  const scrollToWork = () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <Section compact as="div" className="pb-10 pt-10 sm:pb-12 sm:pt-16 lg:pb-10 lg:pt-14">
      <motion.div
        className="flex flex-col"
        initial="hidden"
        animate={ready ? 'visible' : 'hidden'}
        variants={staggerContainer(0.07, phase === 'revealing' ? 0.3 : 0.05)}
      >
        {/* Name — masked line reveal, mirrors the intro's final frame */}
        <h1 className="text-hero flex flex-wrap gap-x-[0.2em] uppercase text-text">
          {[firstName, lastName].filter(Boolean).map((word, i) => (
            <Fragment key={word}>
              {i > 0 && ' '}
              <span className="inline-block overflow-hidden pb-[0.05em]">
                <motion.span className="inline-block whitespace-nowrap" variants={maskUp}>
                  {word}
                </motion.span>
              </span>
            </Fragment>
          ))}
        </h1>

        <motion.div variants={fadeUp} className="mt-5 flex items-center gap-3 sm:mt-7">
          <motion.span aria-hidden="true" variants={ruleDraw} className="h-px w-8 origin-left bg-accent sm:w-12" />
          <span className="text-label text-accent sm:text-[0.8125rem] sm:tracking-[0.2em]">{profile.title}</span>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-12 sm:mt-14 lg:mt-20 lg:grid-cols-12 lg:items-end lg:gap-8">
          {/* Statement + actions */}
          <div className="lg:col-span-6 xl:col-span-5">
            {profile.tagline && (
              <motion.p variants={fadeUp} className="max-w-[34ch] text-lead text-text-secondary">
                {profile.tagline}
              </motion.p>
            )}
            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 xs:flex-row xs:flex-wrap xs:items-center sm:gap-4"
            >
              <Button asChild size="lg" className="w-full justify-center xs:w-auto">
                <Link to={ROUTES.projects}>
                  View work
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full justify-center xs:w-auto">
                <Link to={ROUTES.contact}>Get in touch</Link>
              </Button>
            </motion.div>
          </div>

          {/* System panel — real profile facts in the corner-bracket frame */}
          <motion.div
            variants={fadeUp}
            className="lg:col-span-5 lg:col-start-8 xl:col-span-4 xl:col-start-9"
          >
            <div className="relative border border-border bg-surface/70 p-5 sm:p-6">
              <CornerBrackets />
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="text-label text-text-tertiary">Profile</span>
                <span aria-hidden="true" className="flex items-center gap-1.5">
                  <span className="size-1.5 bg-accent" />
                  <span className="size-1.5 bg-border-strong" />
                  <span className="size-1.5 bg-border-strong" />
                </span>
              </div>
              <motion.dl variants={staggerContainer(0.06, 0.1)} className="flex flex-col">
                {PANEL_ROWS.map((row) => (
                  <motion.div
                    key={row.label}
                    variants={panelRow}
                    className="grid grid-cols-1 gap-1 border-b border-border py-3.5 last:border-b-0 last:pb-0 xs:grid-cols-[8.5rem_1fr] xs:gap-4"
                  >
                    <dt className="text-label pt-0.5 text-text-tertiary">{row.label}</dt>
                    <dd className={row.mono ? 'text-code text-text' : 'text-body-sm text-text'}>{row.value}</dd>
                  </motion.div>
                ))}
                {profile.location && (
                  <motion.div
                    variants={panelRow}
                    className="grid grid-cols-1 gap-1 border-b border-border py-3.5 last:border-b-0 last:pb-0 xs:grid-cols-[8.5rem_1fr] xs:gap-4"
                  >
                    <dt className="text-label pt-0.5 text-text-tertiary">Location</dt>
                    <dd className="flex items-center gap-1.5 text-body-sm text-text">
                      <MapPin className="size-3.5 text-text-tertiary" aria-hidden="true" />
                      {profile.location}
                    </dd>
                  </motion.div>
                )}
                {profile.availability && (
                  <motion.div
                    variants={panelRow}
                    className="grid grid-cols-1 gap-1 border-b border-border py-3.5 last:border-b-0 last:pb-0 xs:grid-cols-[8.5rem_1fr] xs:gap-4"
                  >
                    <dt className="text-label pt-0.5 text-text-tertiary">Status</dt>
                    <dd className="flex items-center gap-2 text-body-sm text-text">
                      <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
                      {profile.availability === 'open-to-work' && 'Open to work'}
                      {profile.availability === 'open-to-freelance' && 'Open to freelance'}
                      {profile.availability === 'not-available' && 'Not currently available'}
                    </dd>
                  </motion.div>
                )}
              </motion.dl>
            </div>
          </motion.div>
        </div>

        {/* Bottom rail — the request path this site follows, plus a scroll cue */}
        <motion.div
          variants={fadeUp}
          className="mt-12 flex items-end justify-between gap-8 border-t border-border pt-6 sm:mt-16 lg:mt-14"
        >
          <SignalStrip />
          <button
            type="button"
            onClick={scrollToWork}
            className="nudge-icons group hidden shrink-0 items-center gap-2 text-label text-text-tertiary transition-colors hover:text-text md:inline-flex"
          >
            <span className="link-underline">Selected work</span>
            <ArrowDown className="size-3.5" aria-hidden="true" />
          </button>
        </motion.div>
      </motion.div>
    </Section>
  )
}

/**
 * The hero's one authored visual element. Not decoration — it's a
 * literal trace of the path a request takes through this developer's
 * actual architecture (interface, service, data), each node labeled
 * with what really runs there. Static by default; the connecting line
 * draws in once and is skipped under reduced motion.
 */
function SignalStrip() {
  const nodeX = [6, 230, 454]

  return (
    <div className="w-full max-w-md" aria-label="Request path: interface, service, data" role="img">
      {/* Small screens: readable flow labels */}
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 sm:hidden">
        {STACK_LAYERS.map((layer, i) => (
          <div key={layer.label} className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-2 text-label text-text-secondary">
              <span className="size-1.5 bg-accent" aria-hidden="true" />
              {layer.label}
            </span>
            {i < STACK_LAYERS.length - 1 && (
              <span className="h-px w-5 bg-border-strong" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>

      {/* sm+: svg trace */}
      <svg
        viewBox="0 0 470 34"
        className="hidden w-full overflow-visible sm:block"
        preserveAspectRatio="xMinYMid meet"
        aria-hidden="true"
      >
        <line
          x1={nodeX[0]}
          y1={6}
          x2={nodeX[2]}
          y2={6}
          className="stroke-border-strong motion-safe:[stroke-dasharray:450] motion-safe:[stroke-dashoffset:450] motion-safe:animate-[signal-draw_1.2s_var(--ease-out-expo)_0.6s_forwards]"
          strokeWidth={1}
        />
        {STACK_LAYERS.map((layer, i) => (
          <g key={layer.label} transform={`translate(${nodeX[i]}, 6)`}>
            <rect x={-4} y={-4} width={8} height={8} className="fill-bg stroke-accent" strokeWidth={1.25} />
            <text
              x={i === 0 ? -4 : i === STACK_LAYERS.length - 1 ? 4 : 0}
              y={26}
              textAnchor={i === 0 ? 'start' : i === STACK_LAYERS.length - 1 ? 'end' : 'middle'}
              className="fill-text-tertiary font-mono"
              style={{ fontSize: 11, letterSpacing: '0.08em' }}
            >
              {layer.label.toUpperCase()}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
