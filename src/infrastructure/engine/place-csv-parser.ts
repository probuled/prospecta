import Papa from 'papaparse'
import type { ScrapedPlace } from '@/application/ports/scraper-gateway'

/** Colunas do CSV do gosom/google-maps-scraper que interessam para prospecção. */
interface EngineCsvRow {
  readonly title?: string
  readonly category?: string
  readonly address?: string
  readonly website?: string
  readonly phone?: string
  readonly emails?: string
  readonly review_rating?: string
  readonly review_count?: string
  readonly place_id?: string
  readonly link?: string
}

function parseEmails(raw = ''): string[] {
  return [...new Set(raw.split(/[,;\s]+/).filter((part) => part.includes('@')))]
}

function parseNumber(raw = ''): number | null {
  const value = Number.parseFloat(raw.replace(',', '.'))
  return Number.isFinite(value) && value > 0 ? value : null
}

function toPlace(row: EngineCsvRow): ScrapedPlace {
  return {
    placeId: row.place_id?.trim() ?? '',
    title: row.title?.trim() ?? '',
    category: row.category?.trim() ?? '',
    address: row.address?.trim() ?? '',
    phone: row.phone?.trim() ?? '',
    website: row.website?.trim() ?? '',
    emails: parseEmails(row.emails),
    rating: parseNumber(row.review_rating),
    reviewCount: Math.trunc(parseNumber(row.review_count) ?? 0),
    mapsUrl: row.link?.trim() ?? '',
  }
}

export function parsePlacesCsv(csv: string): ScrapedPlace[] {
  const { data } = Papa.parse<EngineCsvRow>(csv, { header: true, skipEmptyLines: true })
  return data.map(toPlace).filter((place) => place.title)
}
