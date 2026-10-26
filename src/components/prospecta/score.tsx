import { temperatureOf, type OpportunityLevel } from '@/domain/opportunity'
import { cn } from '@/lib/utils'

const WORDS: Record<OpportunityLevel, string> = { quente: 'Quente', morno: 'Morno', frio: 'Frio' }

const TONES: Record<OpportunityLevel, { readonly text: string; readonly soft: string }> = {
  quente: { text: 'text-quente', soft: 'bg-quente-soft' },
  morno: { text: 'text-morno', soft: 'bg-morno-soft' },
  frio: { text: 'text-frio', soft: 'bg-frio-soft' },
}

const BAR_COUNT = 5

interface ScoreProps {
  readonly value: number
  /** `inline` na tabela; `badge` (fundo tingido) só em cards. */
  readonly variant?: 'inline' | 'badge'
  /** A palavra é obrigatória fora de tabelas densas: cor nunca é o único sinal. */
  readonly showWord?: boolean
  /** Motivos do score, mostrados no tooltip nativo. */
  readonly reasons?: readonly string[]
}

/** Score de oportunidade 0–100: medidor de 5 barras, número em mono e a temperatura. */
export function Score({ value, variant = 'inline', showWord = true, reasons = [] }: ScoreProps) {
  const level = temperatureOf(value)
  const lit = Math.max(1, Math.round(value / (100 / BAR_COUNT)))
  const title = [`Oportunidade ${value}/100`, ...reasons].join(' · ')

  return (
    <span
      title={title}
      className={cn('inline-flex items-center gap-2 whitespace-nowrap', TONES[level].text, variant === 'badge' && cn('rounded-sm py-0.5 pr-2 pl-1.5', TONES[level].soft))}
    >
      <span aria-hidden className="inline-flex items-end gap-0.5">
        {Array.from({ length: BAR_COUNT }, (_, index) => (
          <i key={index} className={cn('block h-3 w-[3px] rounded-[1px]', index < lit ? 'bg-current' : 'bg-line')} />
        ))}
      </span>
      <span className="font-mono text-[13px] leading-5 font-medium text-ink tabular-nums">{value}</span>
      {showWord && <span className="text-[13px] font-medium">{WORDS[level]}</span>}
    </span>
  )
}
