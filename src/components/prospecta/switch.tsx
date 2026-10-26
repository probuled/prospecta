interface SwitchProps {
  readonly checked: boolean
  readonly onChange: (checked: boolean) => void
  /** Com título (e descrição) vira uma linha de configuração com o switch à direita. */
  readonly title?: string
  readonly description?: string
}

export function Switch({ checked, onChange, title, description }: SwitchProps) {
  const toggle = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={title}
      onClick={() => onChange(!checked)}
      className="relative h-5 w-[34px] shrink-0 cursor-pointer rounded-full border border-line-strong bg-surface-sunken p-0 transition-colors after:absolute after:top-0.5 after:left-0.5 after:size-3.5 after:rounded-full after:bg-line-strong after:transition-transform aria-checked:border-ouro aria-checked:bg-ouro aria-checked:after:translate-x-3.5 aria-checked:after:bg-on-ouro"
    />
  )
  if (!title) return toggle

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-medium">{title}</p>
        {description && <p className="text-caption mt-0.5 text-ink-muted">{description}</p>}
      </div>
      {toggle}
    </div>
  )
}
