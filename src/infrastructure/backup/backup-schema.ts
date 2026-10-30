import { z } from 'zod'
import { BACKUP_FORMAT, BACKUP_VERSION, type Backup } from '@/domain/backup'
import { LEAD_STATUSES } from '@/domain/lead'
import { migrateSettings } from '@/domain/settings'

// Status de versões antigas do funil, como no repositório de leads.
const LEGACY_STATUSES: Record<string, string> = { descartado: 'perdido' }

const coordinates = z.object({ lat: z.number(), lon: z.number() })

const profile = z.object({
  description: z.string(),
  neighborhood: z.string(),
  businessStatus: z.string(),
  priceRange: z.string(),
  thumbnailUrl: z.string(),
  images: z.array(z.object({ title: z.string(), url: z.string() })),
  openingHours: z.record(z.string(), z.array(z.string())),
  reviewsPerRating: z.array(z.number()),
  reviews: z.array(z.object({ author: z.string(), rating: z.number(), text: z.string(), when: z.string() })),
  hasOwner: z.boolean(),
  menuUrl: z.string(),
  orderOnlineUrls: z.array(z.string()),
  reservationUrls: z.array(z.string()),
})

const lead = z.object({
  id: z.string().min(1),
  name: z.string(),
  category: z.string(),
  address: z.string(),
  city: z.string(),
  phone: z.string(),
  emails: z.array(z.string()),
  website: z.string(),
  rating: z.number().nullable(),
  reviewCount: z.number(),
  mapsUrl: z.string(),
  searchIds: z.array(z.string()),
  status: z.preprocess((value) => (typeof value === 'string' ? (LEGACY_STATUSES[value] ?? value) : value), z.enum(LEAD_STATUSES)),
  notes: z.string(),
  dealValue: z.number().nullable().optional(),
  followUpAt: z.string().nullable().optional(),
  location: coordinates.nullable().optional(),
  profile: profile.optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

const search = z.object({
  id: z.string().min(1),
  niche: z.string(),
  city: z.string(),
  depth: z.number(),
  withEmails: z.boolean(),
  keyword: z.string(),
  status: z.enum(['working', 'ok', 'failed']),
  leadCount: z.number(),
  maxTimeSeconds: z.number(),
  createdAt: z.string(),
  finishedAt: z.string().optional(),
  changes: z.object({ newLeads: z.number(), gainedSite: z.number() }).optional(),
})

const settings = z.preprocess(
  (value) => migrateSettings(value) ?? value,
  z.object({
    messageTemplates: z.array(z.object({ id: z.string().min(1), name: z.string(), body: z.string() })).min(1),
    activeTemplateId: z.string(),
  }),
)

export const backupSchema = z.object({
  format: z.literal(BACKUP_FORMAT),
  version: z.literal(BACKUP_VERSION),
  exportedAt: z.string(),
  leads: z.array(lead),
  searches: z.array(search),
  settings,
}) satisfies z.ZodType<Backup>
