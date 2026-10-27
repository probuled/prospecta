import type { ReactNode } from 'react'

interface StatusScreenProps {
  /** Código em destaque, ex.: "404". */
  readonly code: string
  readonly title: string
  readonly description: ReactNode
  readonly actions: ReactNode
}

/** Tela cheia de estado (página não encontrada, erro inesperado), centralizada. */
export function StatusScreen({ code, title, description, actions }: StatusScreenProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center sm:py-24">
      <p className="text-6xl leading-none font-bold tracking-tight text-ouro-text">{code}</p>
      <h1 className="text-display text-balance">{title}</h1>
      <div className="text-pretty text-ink-muted">{description}</div>
      <div className="flex flex-wrap justify-center gap-2 pt-2">{actions}</div>
    </div>
  )
}
