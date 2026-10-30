import type { Lead } from './lead'
import type { NeighborComparison } from './neighbor-comparison'
import { describeDiagnosis } from './profile-checklist'

export const DEFAULT_MESSAGE_TEMPLATE =
  'Olá, tudo bem? Encontrei a {nome} no Google Maps e vi que vocês são muito bem avaliados ({nota}★). ' +
  'Notei que ainda não têm um site próprio. Eu crio landing pages profissionais que transformam quem ' +
  'procura vocês no Google em clientes chamando no WhatsApp. Posso te mostrar um exemplo rapidinho?'

export const TEMPLATE_PLACEHOLDERS = ['{nome}', '{categoria}', '{cidade}', '{nota}', '{diagnostico}'] as const

/** O que a mensagem precisa saber além do próprio lead. */
export interface MessageContext {
  readonly comparison?: NeighborComparison | null
}

export function renderMessage(template: string, lead: Lead, context: MessageContext = {}): string {
  const values: Record<(typeof TEMPLATE_PLACEHOLDERS)[number], string> = {
    '{nome}': lead.name,
    '{categoria}': lead.category,
    '{cidade}': lead.city,
    '{nota}': lead.rating?.toFixed(1) ?? '-',
    '{diagnostico}': describeDiagnosis(lead, context.comparison ?? null),
  }
  return Object.entries(values).reduce((text, [placeholder, value]) => text.replaceAll(placeholder, value), template)
}
