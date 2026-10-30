import { describe, expect, it } from 'vitest'
import { describeDiagnosis, profileChecklist } from '../profile-checklist'
import { makeLead, makeProfile } from './fixtures'

const complete = makeProfile({
  hasOwner: true,
  openingHours: { 'segunda-feira': ['09:00–18:00'] },
  thumbnailUrl: 'https://lh3.googleusercontent.com/x',
  description: 'Barbearia clássica',
  reservationUrls: ['https://agenda.com/x'],
})

describe('profileChecklist', () => {
  it('é null para lead salvo antes do perfil completo', () => {
    expect(profileChecklist(makeLead())).toBeNull()
  })

  it('marca o que o perfil tem e o que falta', () => {
    const checklist = profileChecklist(makeLead({ profile: makeProfile({ hasOwner: true }) })) ?? []
    expect(checklist.filter((item) => item.isDone).map((item) => item.id)).toEqual(['owner'])

    const full = profileChecklist(makeLead({ website: 'https://ze.com.br', profile: complete })) ?? []
    expect(full.every((item) => item.isDone)).toBe(true)
  })
})

describe('describeDiagnosis', () => {
  const comparison = { radiusKm: 2, peers: 12, peersWithSite: 8, peersAverageReviews: 90 }

  it('cita os concorrentes com site e as falhas do perfil', () => {
    const lead = makeLead({ profile: makeProfile({ thumbnailUrl: 'https://x.com/a.jpg' }) })
    expect(describeDiagnosis(lead, comparison)).toBe(
      '8 de 12 concorrentes num raio de 2 km já têm site e o perfil de vocês no Google está sem horário de funcionamento',
    )
  })

  it('não cita concorrentes quando o lead já tem site', () => {
    const lead = makeLead({ website: 'https://ze.com.br', profile: makeProfile({ thumbnailUrl: 'https://x.com/a.jpg' }) })
    expect(describeDiagnosis(lead, comparison)).toBe('o perfil de vocês no Google está sem horário de funcionamento')
  })

  it('concorda no singular', () => {
    expect(describeDiagnosis(makeLead(), { ...comparison, peers: 1, peersWithSite: 1 })).toBe(
      '1 de 1 concorrente num raio de 2 km já tem site',
    )
  })

  it('usa uma frase genérica quando não há o que apontar', () => {
    expect(describeDiagnosis(makeLead({ profile: complete }), null)).toBe(
      'dá para atrair bem mais clientes de quem procura vocês no Google',
    )
  })
})
