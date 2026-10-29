import { describe, expect, it } from 'vitest'
import { boundingBoxOf, isValidCoordinates } from '../geo'

describe('isValidCoordinates', () => {
  it('aceita coordenadas reais e recusa (0, 0) e valores fora do globo', () => {
    expect(isValidCoordinates({ lat: -22.9, lon: -47.06 })).toBe(true)
    expect(isValidCoordinates({ lat: 0, lon: 0 })).toBe(false)
    expect(isValidCoordinates({ lat: 91, lon: 10 })).toBe(false)
    expect(isValidCoordinates({ lat: Number.NaN, lon: 10 })).toBe(false)
  })
})

describe('boundingBoxOf', () => {
  it('devolve o retângulo que contém todos os pontos', () => {
    const box = boundingBoxOf([
      { lat: -22.9, lon: -47.1 },
      { lat: -22.8, lon: -47.0 },
      { lat: -23.0, lon: -46.9 },
    ])
    expect(box).toEqual({ southWest: { lat: -23.0, lon: -47.1 }, northEast: { lat: -22.8, lon: -46.9 } })
  })

  it('devolve null sem pontos', () => {
    expect(boundingBoxOf([])).toBeNull()
  })
})
