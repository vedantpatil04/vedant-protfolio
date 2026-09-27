import { useContext } from 'react'
import { IntroContext } from '@/components/intro/intro-context'

/** Current intro phase — the Hero uses it to hold its entrance until the overlay lifts. */
export function useIntro() {
  return useContext(IntroContext)
}
