import { describe, expect, it } from 'vitest'
import { DEFAULT_RESULT_COUNT, DEPTH_LIMITS, depthForResultCount, RESULT_COUNT_OPTIONS } from '../search'

describe('depthForResultCount', () => {
  it('a quantidade padrão equivale à profundidade padrão', () => {
    expect(depthForResultCount(DEFAULT_RESULT_COUNT)).toBe(DEPTH_LIMITS.default)
  })

  it.each([
    [10, 2],
    [20, 4],
    [60, 10],
    [100, 17],
  ])('%i negócios pedem profundidade %i', (count, depth) => {
    expect(depthForResultCount(count)).toBe(depth)
  })

  it('respeita os limites do motor', () => {
    expect(depthForResultCount(0)).toBe(DEPTH_LIMITS.min)
    expect(depthForResultCount(1000)).toBe(DEPTH_LIMITS.max)
  })

  it('toda opção da tela cabe nos limites', () => {
    for (const count of RESULT_COUNT_OPTIONS) {
      expect(depthForResultCount(count)).toBeLessThanOrEqual(DEPTH_LIMITS.max)
    }
  })
})
