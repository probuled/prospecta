import { describe, expect, it } from 'vitest'
import type { Review } from '../business-profile'
import { bestReviews, describeCompliment, describePain, excerpt, findPains, firstName } from '../review-insights'
import { makeLead, makeProfile } from './fixtures'

const review = (rating: number, text: string, author = 'Ana Carla'): Review => ({ author, rating, text, when: 'há 1 mês' })
const withReviews = (...reviews: Review[]) => makeLead({ profile: makeProfile({ reviews }) })

describe('excerpt', () => {
  it('fica com a primeira frase', () => {
    expect(excerpt('Atendimento excelente! Voltarei sempre.')).toBe('Atendimento excelente!')
  })

  it('corta em palavra inteira quando passa do limite', () => {
    expect(excerpt('um texto bem comprido sem ponto final', 15)).toBe('um texto bem…')
  })
})

describe('firstName', () => {
  it('fica só com o primeiro nome', () => {
    expect(firstName('  Ana Carla Souza ')).toBe('Ana')
  })
})

describe('bestReviews', () => {
  it('escolhe as 5 estrelas com mais texto', () => {
    const lead = withReviews(review(5, 'Bom demais, recomendo a todos'), review(4, 'Muito bom mesmo, quase perfeito'), review(5, 'Ok'))
    expect(bestReviews(lead).map((r) => r.text)).toEqual(['Bom demais, recomendo a todos'])
  })
})

describe('findPains', () => {
  it('acha reclamações em avaliações de até 3 estrelas, sem depender de acento', () => {
    const lead = withReviews(
      review(2, 'Liguei várias vezes e NÃO ATENDEM.'),
      review(3, 'Esperei 1 hora na fila.'),
      review(5, 'Esperei pouco, ótimo'),
      review(1, 'Péssimo'),
    )
    expect(findPains(lead).map((pain) => [pain.id, pain.quote])).toEqual([
      ['contato', 'Liguei várias vezes e NÃO ATENDEM.'],
      ['agendamento', 'Esperei 1 hora na fila.'],
    ])
  })

  it('não confunde "atrás do mercado" com atraso', () => {
    expect(findPains(withReviews(review(3, 'Fica atrás do mercado, ok.')))).toEqual([])
  })
})

describe('frases das variáveis', () => {
  it('{elogio} cita a melhor avaliação sem o nome do autor', () => {
    expect(describeCompliment(withReviews(review(5, 'Melhor corte da cidade. Voltarei.')))).toBe(
      'um cliente escreveu no Google: "Melhor corte da cidade."',
    )
  })

  it('{dor} usa a reclamação mais comum', () => {
    expect(describePain(withReviews(review(2, 'Ninguém atende o telefone')))).toBe(
      'alguns clientes comentam que é difícil falar com vocês por telefone',
    )
  })

  it('têm frase genérica para lead sem avaliações', () => {
    expect(describeCompliment(makeLead())).toBe('os clientes falam muito bem de vocês no Google')
    expect(describePain(makeLead())).toBe('muita gente procura vocês no Google e não encontra um site com as informações')
  })
})
