export type FollowUpState = 'overdue' | 'today' | 'upcoming'

export interface FollowUp {
  readonly state: FollowUpState
  readonly date: Date
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

/** Situação do próximo contato em relação a `now`: atrasado, hoje ou futuro. */
export function evaluateFollowUp(followUpAt: string | null | undefined, now: Date): FollowUp | null {
  if (!followUpAt) return null
  const date = new Date(followUpAt)
  if (Number.isNaN(date.getTime())) return null

  if (date.getTime() < now.getTime()) return { state: 'overdue', date }
  return { state: isSameDay(date, now) ? 'today' : 'upcoming', date }
}
