/**
 * Deterministic hash → HSL color for a language name, so the same
 * language always renders the same dot color without shipping a lookup
 * table of every possible GitHub language.
 */
export function languageColor(language: string): string {
  let hash = 0
  for (let i = 0; i < language.length; i++) {
    hash = language.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue} 55% 52%)`
}
