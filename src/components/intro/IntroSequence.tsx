import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useIntro } from '@/hooks/useIntro'
import { profile } from '@/data/profile'
import {
  INTRO_FINAL_HOLD,
  INTRO_GREETINGS,
  INTRO_REDUCED_HOLD,
} from '@/constants/intro'
import { DURATION, EASE_IN_OUT, EASE_OUT_EXPO, EASE_STANDARD, maskUp } from '@/lib/motion'

const TOTAL_STEPS = INTRO_GREETINGS.length + 1 // greetings + final name frame
const TOTAL_MS = INTRO_GREETINGS.reduce((sum, g) => sum + g.hold, 0) + INTRO_FINAL_HOLD

/**
 * The Phase 10 signature moment: a fullscreen, one-word-at-a-time
 * greeting in the languages that shaped the developer — Namaste,
 * नमस्ते (Hindi), ನಮಸ್ಕಾರ (Kannada), नमस्कार (Marathi), Hello,
 * "Hello, World." — resolving into the name, then wiping upward to
 * reveal the real Hero, which is already rendered underneath (the
 * homepage content never leaves the document, so SEO is unaffected).
 *
 * Pure typography + transforms: no images, no fonts beyond the page's
 * own, no network. Skippable (button or Escape). Reduced motion shows
 * only the final frame with an opacity fade.
 */
export function IntroSequence() {
  const { phase, reveal, finish } = useIntro()
  const reduced = useReducedMotion()

  return (
    <AnimatePresence onExitComplete={finish}>
      {phase === 'playing' && (
        <IntroOverlay key="intro" reduced={Boolean(reduced)} onDone={reveal} />
      )}
    </AnimatePresence>
  )
}

function IntroOverlay({ reduced, onDone }: { reduced: boolean; onDone: () => void }) {
  // Reduced motion jumps straight to the final frame.
  const [step, setStep] = useState(reduced ? INTRO_GREETINGS.length : 0)
  const isFinal = step >= INTRO_GREETINGS.length

  // Sequencer — one timer at a time, cleared on unmount/skip.
  useEffect(() => {
    const hold = isFinal
      ? reduced
        ? INTRO_REDUCED_HOLD
        : INTRO_FINAL_HOLD
      : INTRO_GREETINGS[step].hold
    const id = window.setTimeout(() => {
      if (isFinal) onDone()
      else setStep((s) => s + 1)
    }, hold)
    return () => window.clearTimeout(id)
  }, [step, isFinal, reduced, onDone])

  // Escape skips at any point. The page underneath is inert while the
  // overlay is up, so the first Tab lands on "Skip intro" without us
  // stealing focus (which would flash a focus ring on load).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDone()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onDone])

  const [firstName, ...rest] = profile.name.split(' ')
  const lastName = rest.join(' ')

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex flex-col bg-bg text-text"
      initial={false}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
      exit={
        reduced
          ? { opacity: 0, transition: { duration: 0.35, ease: EASE_STANDARD } }
          : { clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.85, ease: EASE_IN_OUT } }
      }
    >
      {/* Calibration corners — the site's recurring motif, framing the stage. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-4 sm:inset-8">
        <span className="absolute left-0 top-0 size-4 border-l border-t border-border-strong" />
        <span className="absolute right-0 top-0 size-4 border-r border-t border-border-strong" />
        <span className="absolute bottom-0 left-0 size-4 border-b border-l border-border-strong" />
        <span className="absolute bottom-0 right-0 size-4 border-b border-r border-border-strong" />
      </div>

      {/* Stage */}
      <motion.div
        aria-hidden="true"
        className="relative flex flex-1 items-center justify-center px-4"
        exit={reduced ? undefined : { y: '-6vh', opacity: 0, transition: { duration: 0.7, ease: EASE_IN_OUT } }}
      >
        <div className="grid place-items-center">
          <AnimatePresence initial={!reduced}>
            {!isFinal ? (
              <motion.span
                key={INTRO_GREETINGS[step].id}
                lang={INTRO_GREETINGS[step].lang}
                className="[grid-area:1/1] whitespace-nowrap text-center font-display font-extrabold leading-[1.3] tracking-[-0.03em] text-[clamp(2rem,0.4rem+8.2vw,7.5rem)]"
                initial={{ opacity: 0, y: '38%', filter: 'blur(10px)' }}
                animate={{
                  opacity: 1,
                  y: '0%',
                  filter: 'blur(0px)',
                  transition: { duration: 0.46, ease: EASE_OUT_EXPO },
                }}
                exit={{
                  opacity: 0,
                  y: '-32%',
                  filter: 'blur(8px)',
                  transition: { duration: 0.28, ease: EASE_STANDARD },
                }}
              >
                {INTRO_GREETINGS[step].text}
              </motion.span>
            ) : (
              <motion.div
                key="final"
                className="[grid-area:1/1] flex flex-col items-center text-center"
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: reduced ? 0 : 0.2 } } }}
              >
                <span className="text-hero flex flex-wrap justify-center gap-x-[0.22em] uppercase">
                  {[firstName, lastName].filter(Boolean).map((word) => (
                    <span key={word} className="inline-block overflow-hidden pb-[0.04em]">
                      <motion.span className="inline-block" variants={maskUp}>
                        {word}
                      </motion.span>
                    </span>
                  ))}
                </span>
                <motion.span
                  className="mt-6 block h-px w-16 origin-center bg-accent sm:mt-8"
                  variants={{
                    hidden: { scaleX: 0 },
                    visible: { scaleX: 1, transition: { duration: DURATION.slow, ease: EASE_OUT_EXPO } },
                  }}
                />
                <motion.span
                  className="text-label mt-5 text-text-secondary sm:mt-6 sm:text-[0.8125rem] sm:tracking-[0.22em]"
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    visible: { opacity: 1, y: 0, transition: { duration: DURATION.medium, ease: EASE_OUT_EXPO } },
                  }}
                >
                  {profile.title}
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Footer rail: progress counter, hairline progress, skip */}
      <div className="relative z-10 flex items-center justify-between gap-4 px-7 pb-7 sm:px-12 sm:pb-12">
        <span aria-hidden="true" className="text-label tabular text-text-tertiary">
          {String(Math.min(step + 1, TOTAL_STEPS)).padStart(2, '0')}
          <span className="mx-1.5 text-border-strong">/</span>
          {String(TOTAL_STEPS).padStart(2, '0')}
        </span>
        <button
          type="button"
          onClick={onDone}
          className="nudge-icons group inline-flex min-h-11 items-center gap-2 rounded-sm px-2 text-label text-text-tertiary transition-colors duration-200 hover:text-text focus-visible:text-text"
        >
          <span className="link-underline">Skip intro</span>
          <span aria-hidden="true" className="hidden rounded-sm border border-border px-1.5 py-0.5 text-[0.625rem] sm:inline">
            Esc
          </span>
        </button>
      </div>

      {!reduced && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-accent/60"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1, transition: { duration: TOTAL_MS / 1000, ease: 'linear' } }}
        />
      )}
    </motion.div>
  )
}
