import { describe, expect, it } from 'vitest'
import { makeProfile } from '@/domain/__tests__/fixtures'
import { parsePlacesCsv } from '../place-csv-parser'

const CSV = `input_id,link,title,category,address,website,phone,review_count,review_rating,latitude,longitude,place_id,owner,emails
1,https://maps.google.com/?cid=1,"Clínica Sorriso, Centro",Dentista,"Rua A, 1",,(19) 99876-5432,212,4.8,-22.9056951,-47.0583412,ChIJ1,"{""id"":""9"",""name"":""Dra. Ana""}","contato@sorriso.com, contato@sorriso.com"
2,https://maps.google.com/?cid=2,Pizzaria Bella,Pizzaria,Rua B,https://instagram.com/bella,,0,,0,0,ChIJ2,,
3,,,,,,,,,,,,,
`

describe('parsePlacesCsv', () => {
  it('converte as linhas do motor em lugares limpos', () => {
    const places = parsePlacesCsv(CSV)

    expect(places).toHaveLength(2)
    expect(places[0]).toEqual({
      placeId: 'ChIJ1',
      title: 'Clínica Sorriso, Centro',
      category: 'Dentista',
      address: 'Rua A, 1',
      phone: '(19) 99876-5432',
      website: '',
      emails: ['contato@sorriso.com'],
      rating: 4.8,
      reviewCount: 212,
      mapsUrl: 'https://maps.google.com/?cid=1',
      location: { lat: -22.9056951, lon: -47.0583412 },
      profile: makeProfile({ hasOwner: true }),
    })
    expect(places[1]).toMatchObject({ rating: null, reviewCount: 0, emails: [], location: null })
  })
})
