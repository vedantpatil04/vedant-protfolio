export interface FormattedGrade {
  label: string
  value: string
}

/**
 * Normalises the free-text `grade` stored per education record into a
 * clean label/value pair for display. Values are never changed — only
 * spacing and the redundant unit word:
 *   "7.95 / 10 CGPA" → { label: 'Aggregate CGPA', value: '7.95/10' }
 *   "77.83%"         → { label: 'Percentage',     value: '77.83%' }
 * Anything unrecognised is shown as-is under "Aggregate".
 */
export function formatGrade(grade?: string | null): FormattedGrade | null {
  if (!grade) return null
  const raw = grade.trim()
  if (!raw) return null

  const outOf = raw.match(/([\d.]+)\s*\/\s*([\d.]+)/)
  if (outOf && (/cgpa|gpa/i.test(raw) || Number(outOf[2]) <= 10)) {
    return { label: /gpa/i.test(raw) && !/cgpa/i.test(raw) ? 'Aggregate GPA' : 'Aggregate CGPA', value: `${outOf[1]}/${outOf[2]}` }
  }

  if (/^[\d.]+\s*%$/.test(raw)) {
    return { label: 'Percentage', value: raw.replace(/\s+/g, '') }
  }

  return { label: 'Aggregate', value: raw }
}
