import type { Lead } from './lead'
import type { NeighborComparison } from './neighbor-comparison'
import { classifyWebsite } from './website-presence'

export type ChecklistItemId = 'site' | 'owner' | 'hours' | 'photo' | 'description' | 'online'

export interface ChecklistItem {
  readonly id: ChecklistItemId
  readonly label: string
  readonly isDone: boolean
  /** Como a falta aparece na mensagem ("sem horário de funcionamento"). */
  readonly missingText: string
}

/** O que um perfil de negócio bem cuidado tem. `null` para lead salvo antes do perfil completo. */
export function profileChecklist(lead: Lead): readonly ChecklistItem[] | null {
  const { profile } = lead
  if (!profile) return null

  return [
    { id: 'site', label: 'Site próprio', isDone: classifyWebsite(lead.website) === 'own', missingText: 'sem site próprio' },
    { id: 'owner', label: 'Dono identificado no Google', isDone: profile.hasOwner, missingText: 'sem dono identificado' },
    {
      id: 'hours',
      label: 'Horário de funcionamento',
      isDone: Object.keys(profile.openingHours).length > 0,
      missingText: 'sem horário de funcionamento',
    },
    { id: 'photo', label: 'Foto no perfil', isDone: Boolean(profile.thumbnailUrl || profile.images.length), missingText: 'sem fotos' },
    { id: 'description', label: 'Descrição do negócio', isDone: Boolean(profile.description), missingText: 'sem descrição' },
    {
      id: 'online',
      label: 'Pedido, cardápio ou agendamento online',
      isDone: Boolean(profile.menuUrl || profile.orderOnlineUrls.length || profile.reservationUrls.length),
      missingText: 'sem pedido ou agendamento online',
    },
  ]
}

// Itens que o dono resolve no próprio perfil do Google e que valem citar na abordagem.
const PROFILE_GAPS_FOR_MESSAGE: readonly ChecklistItemId[] = ['hours', 'photo']

const DIAGNOSIS_FALLBACK = 'dá para atrair bem mais clientes de quem procura vocês no Google'

/** Frase da variável `{diagnostico}`: concorrentes com site por perto e o que falta no perfil. */
export function describeDiagnosis(lead: Lead, comparison: NeighborComparison | null): string {
  const parts: string[] = []
  const hasOwnSite = classifyWebsite(lead.website) === 'own'

  if (!hasOwnSite && comparison && comparison.peersWithSite > 0) {
    const { peers, peersWithSite, radiusKm } = comparison
    parts.push(
      `${peersWithSite} de ${peers} ${peers === 1 ? 'concorrente' : 'concorrentes'} num raio de ${radiusKm} km já ${peersWithSite === 1 ? 'tem' : 'têm'} site`,
    )
  }

  const gaps = (profileChecklist(lead) ?? []).filter((item) => !item.isDone && PROFILE_GAPS_FOR_MESSAGE.includes(item.id))
  if (gaps.length > 0) {
    parts.push(`o perfil de vocês no Google está ${gaps.map((gap) => gap.missingText).join(' e ')}`)
  }

  return parts.length > 0 ? parts.join(' e ') : DIAGNOSIS_FALLBACK
}
