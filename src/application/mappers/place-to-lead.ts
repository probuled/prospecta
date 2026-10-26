import type { ScrapedPlace } from '@/application/ports/scraper-gateway'
import type { Lead } from '@/domain/lead'
import type { Search } from '@/domain/search'

function leadIdOf(place: ScrapedPlace): string {
  return place.placeId || place.mapsUrl || `${place.title}|${place.address}`.toLowerCase()
}

export function placeToLead(place: ScrapedPlace, search: Search, now: string): Lead {
  return {
    id: leadIdOf(place),
    name: place.title,
    category: place.category,
    address: place.address,
    city: search.city,
    phone: place.phone,
    emails: place.emails,
    website: place.website,
    rating: place.rating,
    reviewCount: place.reviewCount,
    mapsUrl: place.mapsUrl,
    searchIds: [search.id],
    status: 'novo',
    notes: '',
    createdAt: now,
    updatedAt: now,
  }
}
