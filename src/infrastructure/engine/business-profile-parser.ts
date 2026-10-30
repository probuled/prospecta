import type { BusinessProfile, ProfileImage, Review } from '@/domain/business-profile'

/** Colunas do CSV do motor que formam o perfil. As complexas vêm como JSON dentro da célula. */
export interface ProfileCsvColumns {
  readonly descriptions?: string
  readonly status?: string
  readonly price_range?: string
  readonly thumbnail?: string
  readonly images?: string
  readonly open_hours?: string
  readonly reviews_per_rating?: string
  readonly user_reviews?: string
  readonly user_reviews_extended?: string
  readonly owner?: string
  readonly menu?: string
  readonly order_online?: string
  readonly reservations?: string
  readonly complete_address?: string
}

// Tudo fica no localStorage (cerca de 5 MB por site): guardamos só o que o diagnóstico e a prévia usam.
const MAX_REVIEWS = 8
const MAX_REVIEW_LENGTH = 600
const MAX_IMAGES = 8

type JsonRecord = Readonly<Record<string, unknown>>

function parseJson(raw = ''): unknown {
  if (!raw.trim()) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asArray(value: unknown): readonly unknown[] {
  return Array.isArray(value) ? value : []
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

/** Só aceita links http(s): o valor vai parar em `src` e `href` na tela. */
function httpUrl(value: unknown): string {
  const url = text(value)
  return /^https?:\/\//i.test(url) ? url : ''
}

function parseImages(raw?: string): ProfileImage[] {
  return asArray(parseJson(raw))
    .filter(isRecord)
    .map((image) => ({ title: text(image.title), url: httpUrl(image.image) }))
    .filter((image) => image.url)
    .slice(0, MAX_IMAGES)
}

function parseOpeningHours(raw?: string): Record<string, string[]> {
  const hours = parseJson(raw)
  if (!isRecord(hours)) return {}
  return Object.fromEntries(Object.entries(hours).map(([day, ranges]) => [day, asArray(ranges).map(text).filter(Boolean)]))
}

function parseReviewsPerRating(raw?: string): number[] {
  const counts = parseJson(raw)
  return [1, 2, 3, 4, 5].map((stars) => {
    const count = isRecord(counts) ? Number(counts[String(stars)]) : 0
    return Number.isFinite(count) && count > 0 ? Math.trunc(count) : 0
  })
}

function toReview(review: JsonRecord): Review {
  const rating = Number(review.Rating)
  return {
    author: text(review.Name),
    rating: Number.isFinite(rating) ? Math.min(5, Math.max(0, Math.round(rating))) : 0,
    text: text(review.Description).slice(0, MAX_REVIEW_LENGTH),
    when: text(review.When),
  }
}

/** Junta as avaliações comuns e as extras, sem repetir, e fica só com as que têm texto. */
function parseReviews(...columns: (string | undefined)[]): Review[] {
  const seen = new Set<string>()
  const reviews: Review[] = []
  for (const column of columns) {
    for (const review of asArray(parseJson(column)).filter(isRecord).map(toReview)) {
      const key = `${review.author}|${review.text}`
      if (!review.text || seen.has(key)) continue
      seen.add(key)
      reviews.push(review)
    }
  }
  return reviews.slice(0, MAX_REVIEWS)
}

function parseLinks(raw?: string): string[] {
  return asArray(parseJson(raw))
    .filter(isRecord)
    .map((source) => httpUrl(source.link))
    .filter(Boolean)
}

function parseSingleLink(raw?: string): string {
  const source = parseJson(raw)
  return isRecord(source) ? httpUrl(source.link) : ''
}

function parseHasOwner(raw?: string): boolean {
  const owner = parseJson(raw)
  return isRecord(owner) && Boolean(text(owner.id))
}

function parseNeighborhood(raw?: string): string {
  const address = parseJson(raw)
  return isRecord(address) ? text(address.borough) : ''
}

export function parseBusinessProfile(row: ProfileCsvColumns): BusinessProfile {
  return {
    description: row.descriptions?.trim() ?? '',
    neighborhood: parseNeighborhood(row.complete_address),
    businessStatus: row.status?.trim() ?? '',
    priceRange: row.price_range?.trim() ?? '',
    thumbnailUrl: httpUrl(row.thumbnail),
    images: parseImages(row.images),
    openingHours: parseOpeningHours(row.open_hours),
    reviewsPerRating: parseReviewsPerRating(row.reviews_per_rating),
    reviews: parseReviews(row.user_reviews, row.user_reviews_extended),
    hasOwner: parseHasOwner(row.owner),
    menuUrl: parseSingleLink(row.menu),
    orderOnlineUrls: parseLinks(row.order_online),
    reservationUrls: parseLinks(row.reservations),
  }
}
