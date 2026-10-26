import { describe, expect, it } from 'vitest'
import { evaluateFollowUp } from '../follow-up'

const now = new Date(2026, 9, 25, 12, 0)

describe('evaluateFollowUp', () => {
  it('sem data não tem follow-up', () => {
    expect(evaluateFollowUp(null, now)).toBeNull()
    expect(evaluateFollowUp(undefined, now)).toBeNull()
    expect(evaluateFollowUp('não é data', now)).toBeNull()
  })

  it.each([
    [new Date(2026, 9, 25, 9, 0), 'overdue'],
    [new Date(2026, 9, 20, 15, 0), 'overdue'],
    [new Date(2026, 9, 25, 17, 0), 'today'],
    [new Date(2026, 9, 26, 9, 0), 'upcoming'],
  ])('%s → %s', (date, state) => {
    expect(evaluateFollowUp(date.toISOString(), now)?.state).toBe(state)
  })
})
