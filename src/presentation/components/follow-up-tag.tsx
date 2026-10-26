import { CalendarClock } from 'lucide-react'
import { evaluateFollowUp, type FollowUpState } from '@/domain/follow-up'
import { cn } from '@/lib/utils'
import { formatFollowUp } from '@/presentation/format'
import { useNow } from '@/presentation/hooks/use-now'

const STATE_CLASSES: Record<FollowUpState, string> = { overdue: 'text-quente', today: 'text-morno', upcoming: 'text-ink-muted' }

const MINUTE_MS = 60_000

/** Próximo contato em uma linha de caption; só atrasado/hoje ganham cor, porque mudam a decisão. */
export function FollowUpTag({ followUpAt }: { readonly followUpAt: string | null | undefined }) {
  const now = new Date(useNow(MINUTE_MS))
  const followUp = evaluateFollowUp(followUpAt, now)
  if (!followUp) return null

  return (
    <span className={cn('inline-flex items-center gap-1.5 text-caption font-medium whitespace-nowrap', STATE_CLASSES[followUp.state])}>
      <CalendarClock className="size-3.5" />
      {formatFollowUp(followUp, now)}
    </span>
  )
}
