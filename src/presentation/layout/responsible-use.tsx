import { TriangleAlert } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '@/components/prospecta/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RESPONSIBLE_USE_NOTICES } from './responsible-use-notices'

interface ResponsibleUseProps {
  /** `sidebar`: linha com texto na barra lateral. `icon`: só o ícone, na barra do topo do celular. */
  readonly variant: 'sidebar' | 'icon'
}

/** Botão "Uso responsável" que abre o aviso sobre os riscos de usar o Prospecta. */
export function ResponsibleUse({ variant }: ResponsibleUseProps) {
  const [isOpen, setIsOpen] = useState(false)
  // Foco inicial no cabeçalho: o aviso abre no começo, e não rolado até o botão Entendi.
  const headerRef = useRef<HTMLDivElement>(null)

  return (
    <>
      {variant === 'sidebar' ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex h-9 cursor-pointer items-center gap-3 rounded-md px-2.5 text-[13px] font-medium text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink"
        >
          <TriangleAlert aria-hidden className="size-[17px] text-morno" />
          Uso responsável
        </button>
      ) : (
        <Button variant="ghost" size="sm" iconOnly icon={TriangleAlert} onClick={() => setIsOpen(true)} aria-label="Uso responsável" />
      )}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          initialFocus={headerRef}
          className="block max-h-[90dvh] gap-0 overflow-y-auto rounded-lg bg-surface p-0 ring-line sm:max-w-2xl"
        >
          <DialogHeader ref={headerRef} tabIndex={-1} className="gap-2 border-b border-line p-5 pr-12 outline-none">
            <DialogTitle className="flex items-center gap-2 text-2xl leading-8 font-bold tracking-tight">
              <TriangleAlert aria-hidden className="size-6 shrink-0 text-morno" />
              Uso responsável
            </DialogTitle>
            <DialogDescription className="text-pretty text-ink-muted">
              Antes de buscar e abordar, conheça os riscos. Seguindo estes cuidados, você protege seu IP, seu número de WhatsApp e as
              pessoas que vai contatar.
            </DialogDescription>
          </DialogHeader>
          <ul className="divide-y divide-line">
            {RESPONSIBLE_USE_NOTICES.map(({ id, icon: Icon, title, summary, tips }) => (
              <li key={id} className="flex gap-4 px-5 py-5">
                <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-md bg-surface-sunken">
                  <Icon className="size-[18px] text-ink-muted" />
                </span>
                <div className="min-w-0 space-y-2">
                  <h3 className="text-base leading-6 font-bold tracking-tight">{title}</h3>
                  <p className="leading-relaxed text-pretty">{summary}</p>
                  {tips.length > 0 && (
                    <ul className="space-y-1">
                      {tips.map((tip) => (
                        <li key={tip} className="flex gap-2 leading-relaxed text-pretty text-ink-muted">
                          <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-ink-faint" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-end border-t border-line p-5">
            <DialogClose render={<Button variant="primary" />}>Entendi</DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
