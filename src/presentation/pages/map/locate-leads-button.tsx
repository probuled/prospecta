import { LoaderCircle, LocateFixed } from 'lucide-react'
import { Button, type ButtonVariant } from '@/components/prospecta/button'
import { formatCount } from '@/presentation/format'
import { useLocateLeads } from './use-locate-leads'

interface LocateLeadsButtonProps {
  readonly unlocatedCount: number
  readonly variant?: ButtonVariant
}

export function LocateLeadsButton({ unlocatedCount, variant }: LocateLeadsButtonProps) {
  const { start, progress, isRunning } = useLocateLeads()
  const label = !progress
    ? `Localizar ${formatCount(unlocatedCount)} ${unlocatedCount === 1 ? 'lead' : 'leads'}`
    : progress.total
      ? `Localizando ${formatCount(progress.done)} de ${formatCount(progress.total)}…`
      : 'Buscando no motor…'

  return (
    <Button variant={variant} icon={isRunning ? LoaderCircle : LocateFixed} onClick={start} disabled={isRunning} aria-live="polite">
      {label}
    </Button>
  )
}
