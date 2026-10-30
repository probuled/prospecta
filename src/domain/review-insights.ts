import type { Review } from './business-profile'
import type { Lead } from './lead'

/** Um problema que os clientes citam e que um site ou sistema resolve. */
export interface Pain {
  readonly id: string
  readonly label: string
  /** Como entra na mensagem, depois de "vi que alguns clientes comentam". */
  readonly messageText: string
  /** Trecho da avaliação que mostra a reclamação. */
  readonly quote: string
}

interface PainRule {
  readonly id: string
  readonly label: string
  readonly messageText: string
  readonly pattern: RegExp
}

// Palavras sem acento: o texto da avaliação é normalizado antes da busca.
const PAIN_RULES: readonly PainRule[] = [
  {
    id: 'contato',
    label: 'Difícil de falar com o negócio',
    messageText: 'que é difícil falar com vocês por telefone',
    pattern: /nao atend|ninguem atend|telefone|liguei|nao responde|whatsapp/,
  },
  {
    id: 'agendamento',
    label: 'Espera e agendamento',
    messageText: 'que esperam muito para ser atendidos',
    pattern: /espera|esperei|fila|demor|agenda|horario marcado|atrasad|atrasou/,
  },
  {
    id: 'informacao',
    label: 'Falta de informação (preço, cardápio, horário)',
    messageText: 'que sentem falta de informação sobre preços e horários',
    pattern: /cardapio|preco|tabela de|informac|estava fechad|nao abriu/,
  },
  {
    id: 'localizacao',
    label: 'Difícil de encontrar o endereço',
    messageText: 'que tiveram dificuldade para achar o endereço',
    pattern: /endereco|nao achei|dificil de achar|dificil de encontrar|localizac/,
  },
]

const MAX_QUOTE_LENGTH = 140

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

/** Primeira frase do texto, cortada em palavra inteira se passar do limite. */
export function excerpt(text: string, maxLength = MAX_QUOTE_LENGTH): string {
  const sentence = (text.match(/^.+?[.!?](\s|$)/)?.[0] ?? text).trim()
  if (sentence.length <= maxLength) return sentence
  return `${sentence.slice(0, maxLength).replace(/\s+\S*$/, '')}…`
}

/** Só o primeiro nome de quem avaliou: o suficiente para citar sem expor a pessoa. */
export function firstName(author: string): string {
  return author.trim().split(/\s+/)[0] ?? ''
}

/** Avaliações 5 estrelas com texto, das mais longas (mais detalhadas) para as mais curtas. */
export function bestReviews(lead: Lead, limit = 3): readonly Review[] {
  return (lead.profile?.reviews ?? [])
    .filter((review) => review.rating >= 5 && review.text.length >= 20)
    .toSorted((a, b) => b.text.length - a.text.length)
    .slice(0, limit)
}

/** Reclamações em avaliações de até 3 estrelas, uma por tipo de problema. */
export function findPains(lead: Lead): readonly Pain[] {
  const complaints = (lead.profile?.reviews ?? []).filter((review) => review.rating > 0 && review.rating <= 3 && review.text)
  return PAIN_RULES.flatMap((rule) => {
    const review = complaints.find((complaint) => rule.pattern.test(normalize(complaint.text)))
    return review ? [{ id: rule.id, label: rule.label, messageText: rule.messageText, quote: excerpt(review.text) }] : []
  })
}

const COMPLIMENT_FALLBACK = 'os clientes falam muito bem de vocês no Google'
const PAIN_FALLBACK = 'muita gente procura vocês no Google e não encontra um site com as informações'

/** Frase da variável `{elogio}`: cita a melhor avaliação, sem o nome de quem escreveu. */
export function describeCompliment(lead: Lead): string {
  const [review] = bestReviews(lead, 1)
  return review ? `um cliente escreveu no Google: "${excerpt(review.text)}"` : COMPLIMENT_FALLBACK
}

/** Frase da variável `{dor}`: o problema mais citado nas avaliações. */
export function describePain(lead: Lead): string {
  const [pain] = findPains(lead)
  return pain ? `alguns clientes comentam ${pain.messageText}` : PAIN_FALLBACK
}
