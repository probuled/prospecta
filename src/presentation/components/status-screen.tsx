import type { ReactNode } from 'react'
import { Logo } from '@/components/prospecta/logo'

interface StatusScreenProps {
  /** Destaque grande acima do título (ex.: o 404 desenhado). */
  readonly hero: ReactNode
  readonly title: string
  readonly description: ReactNode
  readonly actions: ReactNode
}

/** Tela cheia, fora do layout (página não encontrada, erro inesperado): logo, destaque, texto e ações. */
export function StatusScreen({ hero, title, description, actions }: StatusScreenProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center bg-bg px-4 py-12 text-center sm:py-16">
      <Logo height={64} className="mb-10" />
      {hero}
      <h1 className="text-display mt-8 text-balance">{title}</h1>
      <div className="mt-3 max-w-lg text-pretty text-ink-muted">{description}</div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">{actions}</div>
    </main>
  )
}
