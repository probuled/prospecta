import { findInstagram, type InstagramProfile } from '@/domain/instagram'
import type { Lead } from '@/domain/lead'
import type { NeighborComparison } from '@/domain/neighbor-comparison'
import { evaluateOpportunity, type Opportunity } from '@/domain/opportunity'
import { parsePhone, type PhoneInfo } from '@/domain/phone'
import { profileChecklist, type ChecklistItem } from '@/domain/profile-checklist'
import { classifyWebsite, type WebsitePresence } from '@/domain/website-presence'

/** Lead com as classificações derivadas já calculadas, para não recalcular a cada render. */
export interface LeadView {
  readonly lead: Lead
  readonly presence: WebsitePresence
  readonly phone: PhoneInfo | null
  readonly instagram: InstagramProfile | null
  readonly opportunity: Opportunity
  /** Concorrentes da mesma categoria por perto; `null` sem posição ou sem concorrentes. */
  readonly comparison: NeighborComparison | null
  /** `null` para lead salvo antes do perfil completo. */
  readonly checklist: readonly ChecklistItem[] | null
}

export function toLeadView(lead: Lead, compare: (lead: Lead) => NeighborComparison | null): LeadView {
  return {
    lead,
    presence: classifyWebsite(lead.website),
    phone: parsePhone(lead.phone),
    instagram: findInstagram(lead.website),
    opportunity: evaluateOpportunity(lead),
    comparison: compare(lead),
    checklist: profileChecklist(lead),
  }
}
