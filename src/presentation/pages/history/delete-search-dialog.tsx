import { useState } from 'react'
import { Button } from '@/components/prospecta/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { Search } from '@/domain/search'

interface DeleteSearchDialogProps {
  readonly search: Search | null
  readonly onCancel: () => void
  readonly onConfirm: (search: Search, removeLeads: boolean) => void
}

export function DeleteSearchDialog({ search, onCancel, onConfirm }: DeleteSearchDialogProps) {
  const [removeLeads, setRemoveLeads] = useState(false)

  return (
    <Dialog open={search !== null} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="border border-line bg-surface">
        <DialogHeader>
          <DialogTitle className="text-title">Excluir busca</DialogTitle>
          <DialogDescription className="text-ink-muted">{search?.keyword}</DialogDescription>
        </DialogHeader>
        <label className="flex items-start gap-3">
          <Checkbox checked={removeLeads} onCheckedChange={setRemoveLeads} className="mt-0.5" />
          <span>Excluir também os leads desta busca. Leads que aparecem em outras buscas são mantidos, com status e anotações.</span>
        </label>
        <DialogFooter className="border-line bg-surface-sunken">
          <Button variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button className="text-perigo" onClick={() => search && onConfirm(search, removeLeads)}>
            Excluir busca
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
