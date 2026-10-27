import { MapPin, Search } from 'lucide-react'
import type { FormEvent, ReactNode } from 'react'
import { Button } from './button'

interface SearchBarProps {
  readonly niche: string
  readonly city: string
  readonly onNicheChange: (value: string) => void
  readonly onCityChange: (value: string) => void
  readonly onSubmit: () => void
  /** Desabilita e mostra "Buscando…". */
  readonly busy?: boolean
  readonly disabled?: boolean
  readonly submitLabel?: string
}

function Field({ icon: Icon, label, children }: { icon: typeof Search; label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3 rounded-md px-3 py-2 focus-within:bg-surface-hover md:py-0 md:[&+&]:rounded-l-none md:[&+&]:border-l md:[&+&]:border-line">
      <Icon className="size-[18px] shrink-0 text-ink-muted" />
      <label className="flex min-w-0 flex-1 flex-col gap-px">
        <span className="text-overline text-ink-muted">{label}</span>
        {children}
      </label>
    </div>
  )
}

const inputClass = 'min-w-0 bg-transparent p-0 text-[15px] leading-5 text-ink outline-none placeholder:text-ink-muted'

/** A barra principal: Nicho + Cidade + botão primário, numa peça de 56px. Uma por tela. */
export function SearchBar({
  niche,
  city,
  onNicheChange,
  onCityChange,
  onSubmit,
  busy,
  disabled,
  submitLabel = 'Buscar leads',
}: SearchBarProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-1 rounded-lg border border-line-strong bg-surface p-1.5 has-[input:focus-visible]:shadow-[var(--focus-ring)] md:h-14 md:flex-row md:items-stretch md:gap-0"
    >
      <Field icon={Search} label="Nicho">
        <input
          data-focus-inner
          className={inputClass}
          placeholder="Ex.: barbearias"
          value={niche}
          onChange={(e) => onNicheChange(e.target.value)}
        />
      </Field>
      <Field icon={MapPin} label="Cidade">
        <input
          data-focus-inner
          className={inputClass}
          placeholder="Ex.: Recife, PE"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
        />
      </Field>
      <Button type="submit" variant="primary" icon={Search} disabled={busy || disabled} className="h-11 px-5 md:h-full">
        {busy ? 'Buscando…' : submitLabel}
      </Button>
    </form>
  )
}
