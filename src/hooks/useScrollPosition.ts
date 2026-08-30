import { useEffect, useState } from 'react'

/**
 * Tracks whether the page has scrolled past `threshold` pixels.
 * Used by the navbar to apply a subtle elevated state on scroll.
 */
export function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}
