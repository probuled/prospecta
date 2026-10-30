import { ArchiveRestore, DatabaseBackup } from 'lucide-react'
import { useRef, useState, type ChangeEvent } from 'react'
import { toast } from 'sonner'
import { useDependencies } from '@/app/dependencies-context'
import { Button } from '@/components/prospecta/button'
import type { RestoreSummary } from '@/domain/backup'

const plural = (count: number, singular: string, pluralForm: string) => `${count} ${count === 1 ? singular : pluralForm}`

function describeSummary({ leadsAdded, leadsUpdated, searchesAdded, templatesAdded }: RestoreSummary): string {
  const parts = [
    plural(leadsAdded, 'lead novo', 'leads novos'),
    plural(leadsUpdated, 'lead atualizado', 'leads atualizados'),
    plural(searchesAdded, 'busca', 'buscas'),
    plural(templatesAdded, 'modelo de mensagem', 'modelos de mensagem'),
  ]
  return `${parts.join(', ')}.`
}

/** Baixa e restaura o backup completo. O backup guarda o que o CSV não guarda: etapa, notas, valor e mensagens. */
export function BackupActions({ canDownload = true }: { readonly canDownload?: boolean }) {
  const { backup } = useDependencies()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isRestoring, setIsRestoring] = useState(false)

  const handleRestore = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    // Limpa para poder escolher o mesmo arquivo de novo.
    event.target.value = ''
    if (!file) return
    setIsRestoring(true)
    try {
      const summary = await backup.restore(file)
      toast.success('Backup restaurado', { description: describeSummary(summary) })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível restaurar o backup.')
    } finally {
      setIsRestoring(false)
    }
  }

  return (
    <>
      {canDownload && (
        <Button icon={DatabaseBackup} onClick={() => backup.download()} title="Leads, etapas, notas, buscas e mensagens num arquivo">
          Baixar backup
        </Button>
      )}
      <Button icon={ArchiveRestore} onClick={() => inputRef.current?.click()} disabled={isRestoring}>
        {isRestoring ? 'Restaurando…' : 'Restaurar backup'}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        aria-label="Arquivo de backup"
        className="hidden"
        onChange={handleRestore}
      />
    </>
  )
}
