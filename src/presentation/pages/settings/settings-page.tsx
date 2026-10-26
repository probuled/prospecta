import { RotateCcw } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { useDependencies } from '@/app/dependencies-context'
import { Button } from '@/components/prospecta/button'
import { PageHeader } from '@/components/prospecta/page-header'
import { Panel } from '@/components/prospecta/panel'
import type { Lead } from '@/domain/lead'
import { DEFAULT_MESSAGE_TEMPLATE, renderMessage, TEMPLATE_PLACEHOLDERS } from '@/domain/message-template'
import { formatCount } from '@/presentation/format'
import { useSettings } from '@/presentation/hooks/use-store'

const SAMPLE_LEAD: Lead = {
  id: 'exemplo',
  name: 'Barbearia Navalha de Ouro',
  category: 'Barbearia',
  address: 'Rua das Flores, 123',
  city: 'Recife, PE',
  phone: '(81) 99999-0000',
  emails: [],
  website: '',
  rating: 4.8,
  reviewCount: 212,
  mapsUrl: '',
  searchIds: [],
  status: 'novo',
  notes: '',
  createdAt: '',
  updatedAt: '',
}

export function SettingsPage() {
  const { settings: settingsRepository } = useDependencies()
  const settings = useSettings()
  const [template, setTemplate] = useState(settings.messageTemplate)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isDirty = template !== settings.messageTemplate

  const save = () => {
    settingsRepository.save({ ...settings, messageTemplate: template })
    toast.success('Mensagem salva')
  }

  /** Insere a variável onde está o cursor, em vez de jogar no fim do texto. */
  const insertPlaceholder = (placeholder: string) => {
    const textarea = textareaRef.current
    const start = textarea?.selectionStart ?? template.length
    const end = textarea?.selectionEnd ?? template.length
    setTemplate(template.slice(0, start) + placeholder + template.slice(end))
    requestAnimationFrame(() => {
      textarea?.focus()
      textarea?.setSelectionRange(start + placeholder.length, start + placeholder.length)
    })
  }

  return (
    <>
      <PageHeader title="Mensagem" description="O texto que já vai escrito quando você abre o WhatsApp de um lead. Mensagens curtas e pessoais têm mais respostas." />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border border-line-strong bg-surface focus-within:shadow-[var(--focus-ring)]">
            <label htmlFor="template" className="sr-only">
              Modelo da mensagem
            </label>
            <textarea
              id="template"
              ref={textareaRef}
              rows={12}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              data-focus-inner
              className="block min-h-64 w-full resize-none bg-transparent p-4 leading-relaxed outline-none"
            />
            <div className="flex flex-wrap items-center gap-2 border-t border-line bg-surface-sunken px-3 py-2">
              <span className="text-[13px] text-ink-muted">Inserir</span>
              {TEMPLATE_PLACEHOLDERS.map((placeholder) => (
                <button
                  key={placeholder}
                  type="button"
                  onClick={() => insertPlaceholder(placeholder)}
                  className="h-7 cursor-pointer rounded-sm border border-line bg-surface px-2 font-mono text-xs text-ink hover:border-line-strong"
                >
                  {placeholder}
                </button>
              ))}
              <span className="ml-auto text-data text-ink-muted">{formatCount(template.length)} caracteres</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={save} disabled={!isDirty}>
              Salvar mensagem
            </Button>
            <Button variant="ghost" icon={RotateCcw} onClick={() => setTemplate(DEFAULT_MESSAGE_TEMPLATE)}>
              Restaurar padrão
            </Button>
          </div>
        </div>
        <Panel title="Prévia" bodyClassName="bg-surface-sunken rounded-b-lg">
          <p className="mb-3 text-caption text-ink-muted">Como chega para {SAMPLE_LEAD.name}</p>
          <div className="ml-auto max-w-[85%] rounded-lg rounded-tr-sm border border-line bg-surface px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap">
            {renderMessage(template, SAMPLE_LEAD)}
          </div>
        </Panel>
      </div>
      <p className="text-caption text-ink-muted">Envie uma mensagem por vez. Disparo em massa pode banir seu número e esbarrar na LGPD.</p>
    </>
  )
}
