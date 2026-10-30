import type { BusinessProfile } from '../business-profile'
import type { Lead } from '../lead'

export function makeLead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: 'place-1',
    name: 'Clínica Sorriso',
    category: 'Dentista',
    address: 'Rua A, 1',
    city: 'Campinas, SP',
    phone: '',
    emails: [],
    website: '',
    rating: null,
    reviewCount: 0,
    mapsUrl: '',
    searchIds: ['s1'],
    status: 'novo',
    notes: '',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

export function makeProfile(overrides: Partial<BusinessProfile> = {}): BusinessProfile {
  return {
    description: '',
    neighborhood: '',
    businessStatus: '',
    priceRange: '',
    thumbnailUrl: '',
    images: [],
    openingHours: {},
    reviewsPerRating: [0, 0, 0, 0, 0],
    reviews: [],
    hasOwner: false,
    menuUrl: '',
    orderOnlineUrls: [],
    reservationUrls: [],
    ...overrides,
  }
}
