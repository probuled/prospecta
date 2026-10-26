import type { Lead } from '@/domain/lead'
import { evaluateOpportunity, type Opportunity } from '@/domain/opportunity'
import { parsePhone, type PhoneInfo } from '@/domain/phone'
import { classifyWebsite, type WebsitePresence } from '@/domain/website-presence'

/** Lead com as classificações derivadas já calculadas, para não recalcular a cada render. */
export interface LeadView {
  readonly lead: Lead
  readonly presence: WebsitePresence
  readonly phone: PhoneInfo | null
  readonly opportunity: Opportunity
}

export function toLeadView(lead: Lead): LeadView {
  return {
    lead,
    presence: classifyWebsite(lead.website),
    phone: parsePhone(lead.phone),
    opportunity: evaluateOpportunity(lead),
  }
}
