import { describe, expect, it } from 'vitest'
import { makeProfile } from '@/domain/__tests__/fixtures'
import { parseBusinessProfile } from '../business-profile-parser'

const review = (name: string, rating: number, description: string) => ({
  Name: name,
  ProfilePicture: '',
  Rating: rating,
  Description: description,
  Images: null,
  When: 'há 2 meses',
})

describe('parseBusinessProfile', () => {
  it('lê as colunas JSON do motor', () => {
    const profile = parseBusinessProfile({
      descriptions: ' Corte e barba desde 1998 ',
      status: '',
      price_range: '$$',
      thumbnail: 'https://lh5.googleusercontent.com/thumb.jpg',
      images: JSON.stringify([
        { title: 'Fachada', image: 'https://lh5.googleusercontent.com/a.jpg' },
        { title: 'Ruim', image: 'javascript:alert(1)' },
      ]),
      open_hours: JSON.stringify({ 'segunda-feira': ['09:00–19:00'], domingo: ['Fechado'] }),
      reviews_per_rating: JSON.stringify({ '1': 2, '4': 10, '5': 88 }),
      user_reviews: JSON.stringify([review('Ana', 5, 'Atendimento excelente'), review('Bia', 1, '')]),
      user_reviews_extended: JSON.stringify([review('Ana', 5, 'Atendimento excelente'), review('Caio', 2, 'Não atendem o telefone')]),
      owner: JSON.stringify({ id: '1234', name: 'Zé', link: 'https://www.google.com/maps/contrib/1234' }),
      menu: JSON.stringify({ link: 'https://cardapio.com/ze', source: 'cardapio.com' }),
      order_online: 'null',
      reservations: JSON.stringify([{ link: 'https://agenda.com/ze', source: 'agenda.com' }]),
      complete_address: JSON.stringify({ borough: 'Cambuí', city: 'Campinas' }),
    })

    expect(profile).toEqual(
      makeProfile({
        description: 'Corte e barba desde 1998',
        neighborhood: 'Cambuí',
        priceRange: '$$',
        thumbnailUrl: 'https://lh5.googleusercontent.com/thumb.jpg',
        images: [{ title: 'Fachada', url: 'https://lh5.googleusercontent.com/a.jpg' }],
        openingHours: { 'segunda-feira': ['09:00–19:00'], domingo: ['Fechado'] },
        reviewsPerRating: [2, 0, 0, 10, 88],
        reviews: [
          { author: 'Ana', rating: 5, text: 'Atendimento excelente', when: 'há 2 meses' },
          { author: 'Caio', rating: 2, text: 'Não atendem o telefone', when: 'há 2 meses' },
        ],
        hasOwner: true,
        menuUrl: 'https://cardapio.com/ze',
        reservationUrls: ['https://agenda.com/ze'],
      }),
    )
  })

  it('devolve o perfil vazio quando as colunas faltam ou vêm quebradas', () => {
    expect(parseBusinessProfile({})).toEqual(makeProfile())
    expect(
      parseBusinessProfile({
        images: '{quebrado',
        owner: '{"id":"","name":"Barbearia Rota 22 (proprietário)"}',
        reviews_per_rating: '[]',
        open_hours: '"x"',
      }),
    ).toEqual(makeProfile())
  })
})
