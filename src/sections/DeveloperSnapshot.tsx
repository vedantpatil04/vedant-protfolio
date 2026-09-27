import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Section } from '@/components/layout'
import { Reveal } from '@/components/shared'
import { profile } from '@/data/profile'
import { STACK_LAYERS } from '@/constants/stack'
import { ROUTES } from '@/constants/routes'
import { revealViewport, ruleDraw, staggerContainer } from '@/lib/motion'

/**
 * A short, honest intro directly beneath the hero — set as an editorial
 * statement rather than a card. Deliberately avoids invented years of
 * experience or project counts: this is copy, not a stats block. The
 * three layers beneath restate the Hero's signal strip as plain
 * label/value columns (one visual idea per section).
 */
export function DeveloperSnapshot() {
  return (
    <Section id="snapshot" className="pt-6 sm:pt-10 lg:pt-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-3">
          <h2 className="text-label flex items-center gap-2.5 text-text-tertiary lg:pt-3">
            <span aria-hidden="true" className="size-1.5 bg-accent" />
            Snapshot
          </h2>
        </Reveal>

        <div className="lg:col-span-9">
          <Reveal>
            <p className="max-w-[30ch] font-display text-[clamp(1.5rem,1.1rem+1.9vw,2.6rem)] font-semibold leading-[1.18] tracking-[-0.025em] text-text-secondary sm:max-w-[34ch]">
              <span className="text-text">{profile.name.split(' ')[0]} works across the stack</span> — building
              interfaces in <span className="text-text">React and TypeScript</span>, and the services behind them
              in <span className="text-text">Node.js, Express and MongoDB</span>.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-6 max-w-[58ch] text-body-lg text-text-secondary">
              This site is itself a working example: the codebase is structured the same way the projects on it are.
            </p>
          </Reveal>

          <motion.dl
            className="mt-12 grid grid-cols-1 gap-x-8 gap-y-8 xs:grid-cols-2 sm:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            variants={staggerContainer(0.08)}
          >
            {STACK_LAYERS.map((layer) => (
              <div key={layer.label} className="relative pt-5">
                <motion.span
                  aria-hidden="true"
                  variants={ruleDraw}
                  className="absolute inset-x-0 top-0 h-px origin-left bg-border-strong"
                />
                <dt className="text-label text-text-tertiary">{layer.label}</dt>
                <dd className="mt-2.5 text-body-sm leading-relaxed text-text">{layer.items.join(' · ')}</dd>
              </div>
            ))}
          </motion.dl>

          <Reveal delay={0.1}>
            <Link
              to={ROUTES.about}
              className="nudge-icons mt-10 inline-flex items-center gap-2 text-body-sm font-medium text-text"
            >
              <span className="link-underline">More about me</span>
              <ArrowRight className="size-4 text-accent" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
