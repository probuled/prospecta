import { describe, expect, it } from 'vitest'
import { buildPipeline } from '../pipeline'
import { makeLead } from './fixtures'

describe('buildPipeline', () => {
  it('agrupa por status na ordem do funil e soma os valores', () => {
    const leads = [
      makeLead({ id: 'a', status: 'respondeu', dealValue: 1500 }),
      makeLead({ id: 'b', status: 'novo' }),
      makeLead({ id: 'c', status: 'respondeu', dealValue: 2000 }),
      makeLead({ id: 'd', status: 'respondeu', dealValue: null }),
    ]

    const columns = buildPipeline(leads, (lead) => lead)

    expect(columns.map((column) => column.status)).toEqual(['novo', 'contatado', 'respondeu', 'negociando', 'fechado', 'perdido'])
    expect(columns[0].items.map((lead) => lead.id)).toEqual(['b'])
    expect(columns[2]).toMatchObject({ totalValue: 3500 })
    expect(columns[2].items).toHaveLength(3)
  })
})
