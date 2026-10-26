import type { FollowUp } from '@/domain/follow-up'

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
const timeFormatter = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' })
const dayFormatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })

export const formatCurrency = (value: number) => currencyFormatter.format(value)

function isTomorrow(date: Date, now: Date): boolean {
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  return date.toDateString() === tomorrow.toDateString()
}

/** "Hoje, 09:00", "Amanhã, 11:00" ou "qua., 21/10, 15:00"; atrasados ganham o prefixo "Atrasado". */
export function formatFollowUp({ state, date }: FollowUp, now: Date): string {
  const time = timeFormatter.format(date)
  const sameDay = date.toDateString() === now.toDateString()
  const day = sameDay ? 'Hoje' : isTomorrow(date, now) ? 'Amanhã' : dayFormatter.format(date)
  return state === 'overdue' ? `Atrasado · ${day}, ${time}` : `${day}, ${time}`
}

/** Converte ISO para o formato que o <input type="datetime-local"> espera, no fuso local. */
export function toDateTimeLocal(iso: string | null | undefined): string {
  if (!iso) return ''
  const date = new Date(iso)
  const offsetMs = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16)
}

export function fromDateTimeLocal(value: string): string | null {
  return value ? new Date(value).toISOString() : null
}

const ratingFormatter = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const countFormatter = new Intl.NumberFormat('pt-BR')

/** Nota do Google em pt-BR: 4,9. */
export const formatRating = (value: number) => ratingFormatter.format(value)

/** Contagens com milhar em ponto: 1.203. */
export const formatCount = (value: number) => countFormatter.format(value)

/** Duração curta: 2m 47s. */
export function formatDuration(totalSeconds: number): string {
  return `${Math.floor(totalSeconds / 60)}m ${String(totalSeconds % 60).padStart(2, '0')}s`
}
