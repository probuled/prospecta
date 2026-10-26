import type { Lead } from '@/domain/lead'

export interface LeadExporter {
  export(leads: readonly Lead[], fileName: string): void
}
