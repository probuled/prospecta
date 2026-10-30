import { describe, expect, it } from 'vitest'
import { buildSitePrompt, defaultSitePromptOptions, sitePromptCoverage } from '../site-prompt'
import { styleOf } from '../site-prompt-styles'
import { makeLead, makeProfile } from './fixtures'

const lead = makeLead({
  name: 'Barbearia 22 de Julho',
  category: 'Barbearia',
  address: 'Av. Pref. Geraldo Pinho Alves, 56 - Maranguape I, Paulista - PE',
  city: 'Paulista, PE',
  phone: '(81) 98836-8159',
  rating: 4.7,
  reviewCount: 93,
  mapsUrl: 'https://maps.google.com/?cid=1',
  location: { lat: -7.94, lon: -34.87 },
  profile: makeProfile({
    neighborhood: 'Maranguape I',
    thumbnailUrl: 'https://lh3.googleusercontent.com/capa',
    openingHours: { 'segunda-feira': ['09:00–20:30'], domingo: ['Fechado'] },
    reviewsPerRating: [0, 1, 0, 4, 88],
    reviews: [
      { author: 'Ana Carla', rating: 5, text: 'Atendimento top, guaraná gelado e fliperama enquanto espera.', when: '' },
      { author: 'Bruno Lima', rating: 2, text: 'Liguei e ninguém atendeu.', when: '' },
    ],
  }),
})

const comparison = { radiusKm: 2, peers: 30, peersWithSite: 6, peersAverageReviews: 61 }

describe('styleOf', () => {
  it.each([
    ['Barbearia', 'beleza'],
    ['Hamburgueria', 'comida'],
    ['Clínica odontológica', 'saude'],
    ['Oficina mecânica', 'automotivo'],
    ['Loja de automóveis', 'automotivo'],
    ['Clínica veterinária', 'pet'],
    ['Pet shop', 'pet'],
    ['Petiscaria', 'comida'],
    ['Autoescola', 'educacao'],
    ['Escola de idiomas', 'educacao'],
    ['Academia', 'fitness'],
    ['Espaço Fitness Pilates', 'fitness'],
    ['Eletricista', 'casa'],
    ['Loja de materiais de construção', 'casa'],
    ['Loja de móveis', 'casa'],
    ['Loja de roupas', 'moda'],
    ['Ótica', 'moda'],
    ['Escritório de advocacia', 'profissional'],
    ['Escritório de contabilidade', 'profissional'],
    ['Imobiliária', 'imoveis'],
    ['Corretor de imóveis', 'imoveis'],
    ['Buffet infantil', 'eventos'],
    ['Salão de festas', 'eventos'],
    ['Fotógrafo de casamento', 'eventos'],
    ['Pousada', 'hospedagem'],
    ['Assistência técnica de celulares', 'tecnologia'],
    ['Day spa', 'beleza'],
    ['Lavanderia', 'geral'],
  ])('%s → %s', (category, style) => {
    expect(styleOf(category)).toBe(style)
  })
})

describe('buildSitePrompt', () => {
  const prompt = buildSitePrompt(lead, defaultSitePromptOptions(lead), comparison)

  it('abre com o pedido e o negócio', () => {
    expect(prompt.startsWith('# Site para Barbearia 22 de Julho')).toBe(true)
    expect(prompt).toContain('Crie a landing page de **Barbearia 22 de Julho**, barbearia em Maranguape I, Paulista, PE.')
  })

  it('leva todos os dados do lead', () => {
    expect(prompt).toContain('- **Endereço:** Av. Pref. Geraldo Pinho Alves, 56')
    expect(prompt).toContain('https://api.whatsapp.com/send?phone=5581988368159')
    expect(prompt).toContain('- **Nota no Google:** 4.7 de 5, com 93 avaliações')
    expect(prompt).toContain('- segunda-feira: 09:00–20:30')
    expect(prompt).toContain('- Foto de capa do Google: https://lh3.googleusercontent.com/capa')
    expect(prompt).toContain('> "Atendimento top, guaraná gelado e fliperama enquanto espera." — Ana, 5★')
    expect(prompt).toContain('Difícil de falar com o negócio ("Liguei e ninguém atendeu.") → botão de WhatsApp fixo')
    expect(prompt).toContain('6 de 30 concorrentes da mesma categoria num raio de 2 km já têm site')
    expect(prompt).toContain('https://www.google.com/maps?q=-7.94,-34.87&z=16&output=embed')
  })

  it('limpa o que vem sujo do Google', () => {
    const messy = makeLead({
      name: 'Zé Cortes',
      address: 'Zé Cortes - Rua A, 1',
      mapsUrl: 'https://www.google.com/maps/place/Ze/data=!4m7?authuser=0&hl=pt-BR',
      profile: makeProfile({
        openingHours: { domingo: ['Fechado'], 'segunda-feira': ['09:00–18:00'], sábado: ['08:00–12:00'] },
        reviews: [{ author: 'Ana', rating: 5, text: 'Ótimo lugar.\n\nVoltarei com certeza!', when: '' }],
      }),
    })
    const text = buildSitePrompt(messy, defaultSitePromptOptions(messy), null)
    expect(text).toContain('- **Endereço:** Rua A, 1')
    expect(text).toContain('- **Página no Google Maps:** https://www.google.com/maps/place/Ze/data=!4m7\n')
    expect(text).toContain('- segunda-feira: 09:00–18:00\n- sábado: 08:00–12:00\n- domingo: Fechado')
    expect(text).toContain('> "Ótimo lugar. Voltarei com certeza!" — Ana, 5★')
  })

  it('traz a direção de arte do nicho e as regras de design e de honestidade', () => {
    expect(prompt).toContain('Playfair Display')
    expect(prompt).toContain('Agendar horário pelo WhatsApp')
    expect(prompt).toContain('Evite a cara de site feito por IA')
    expect(prompt).toContain('BeautySalon, HairSalon ou BarberShop')
    expect(prompt).toContain('Não invente preço')
  })

  it('muda a entrega conforme a ferramenta e inclui as observações', () => {
    const react = buildSitePrompt(lead, { target: 'react', style: 'beleza', notes: 'Dono prefere tons de azul.' }, null)
    expect(react).toContain('React + TypeScript + Tailwind CSS')
    expect(react).toContain('Dono prefere tons de azul.')
    expect(react).not.toContain('concorrentes')
  })

  it('não deixa linhas vazias de dados e orienta quando faltam fotos', () => {
    const bare = buildSitePrompt(makeLead(), defaultSitePromptOptions(makeLead()), null)
    expect(bare).not.toMatch(/\*\*: ?$/m)
    expect(bare).not.toContain('undefined')
    expect(bare).toContain('Não há fotos do negócio')
    expect(bare).toContain('Não informado no Google')
  })
})

describe('sitePromptCoverage', () => {
  it('resume o que o prompt conseguiu reunir', () => {
    expect(sitePromptCoverage(lead)).toEqual({
      photos: 1,
      reviews: 1,
      hasHours: true,
      hasDescription: false,
      hasLocation: true,
      hasWhatsApp: true,
      pains: 1,
    })
  })
})
