import type { CSSProperties } from 'react'

interface SliderProps {
  readonly label: string
  readonly min: number
  readonly max: number
  readonly value: number
  readonly onChange: (value: number) => void
  /** Texto do valor à direita, em mono. */
  readonly format?: (value: number) => string
  /** A consequência da escolha. */
  readonly hint?: string
}

/** Preenchimento em `ink`, não em ouro: ouro fica reservado à ação primária. Estilos do trilho em index.css (.pr-range). */
export function Slider({ label, min, max, value, onChange, format, hint }: SliderProps) {
  const percent = ((value - min) / (max - min)) * 100

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="font-medium">{label}</span>
        <span className="text-data text-ink-muted">{format ? format(value) : value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ '--pct': `${percent}%` } as CSSProperties}
        className="pr-range"
      />
      {hint && <p className="text-caption text-ink-muted">{hint}</p>}
    </div>
  )
}
