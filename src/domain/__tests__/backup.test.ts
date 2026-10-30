import { describe, expect, it } from 'vitest'
import { createBackup, mergeBackup, type AppData } from '../backup'
import type { Search } from '../search'
import { DEFAULT_SETTINGS } from '../settings'
import { makeLead } from './fixtures'

const search = (id: string, createdAt: string): Search => ({
  id,
  niche: 'Barbearia',
  city: 'Recife, PE',
  depth: 5,
  withEmails: false,
  keyword: 'Barbearia em Recife, PE',
  status: 'ok',
  leadCount: 1,
  maxTimeSeconds: 400,
  createdAt,
})

describe('mergeBackup', () => {
  const current: AppData = {
    leads: [
      makeLead({ id: 'a', status: 'negociando', updatedAt: '2026-10-20T00:00:00.000Z' }),
      makeLead({ id: 'b', status: 'novo', updatedAt: '2026-10-01T00:00:00.000Z' }),
    ],
    searches: [search('s2', '2026-10-02T00:00:00.000Z')],
    settings: DEFAULT_SETTINGS,
  }
  const backup = createBackup(
    {
      leads: [
        makeLead({ id: 'a', status: 'contatado', updatedAt: '2026-10-10T00:00:00.000Z' }),
        makeLead({ id: 'b', status: 'respondeu', updatedAt: '2026-10-15T00:00:00.000Z' }),
        makeLead({ id: 'c' }),
      ],
      searches: [search('s1', '2026-10-01T00:00:00.000Z'), search('s2', '2026-10-02T00:00:00.000Z')],
      settings: {
        ...DEFAULT_SETTINGS,
        messageTemplates: [...DEFAULT_SETTINGS.messageTemplates, { id: 'extra', name: 'Extra', body: 'Oi {nome}' }],
      },
    },
    new Date('2026-10-30T12:00:00.000Z'),
  )

  it('adiciona o que falta e mantém a versão mais recente de cada lead', () => {
    const { data, summary } = mergeBackup(current, backup)

    expect(Object.fromEntries(data.leads.map((lead) => [lead.id, lead.status]))).toEqual({
      a: 'negociando',
      b: 'respondeu',
      c: 'novo',
    })
    expect(data.searches.map((s) => s.id)).toEqual(['s2', 's1'])
    expect(data.settings.messageTemplates.map((t) => t.id)).toEqual(['padrao', 'extra'])
    expect(data.settings.activeTemplateId).toBe('padrao')
    expect(summary).toEqual({ leadsAdded: 1, leadsUpdated: 1, searchesAdded: 1, templatesAdded: 1 })
  })

  it('não passa do limite de modelos de mensagem', () => {
    const full = Array.from({ length: 10 }, (_, index) => ({ id: `t${index}`, name: `T${index}`, body: '' }))
    const { summary } = mergeBackup({ ...current, settings: { messageTemplates: full, activeTemplateId: 't0' } }, backup)
    expect(summary.templatesAdded).toBe(0)
  })
})
