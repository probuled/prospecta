import { Check, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { useDependencies } from '@/app/dependencies-context'
import { Button } from '@/components/prospecta/button'
import { Input } from '@/components/prospecta/input'
import { PageHeader } from '@/components/prospecta/page-header'
import { Panel } from '@/components/prospecta/panel'
import type { Lead } from '@/domain/lead'
import { DEFAULT_MESSAGE_TEMPLATE, renderMessage, TEMPLATE_PLACEHOLDERS } from '@/domain/message-template'
import {
  activeTemplate,
  addTemplate,
  canAddTemplate,
  MAX_MESSAGE_TEMPLATES,
  removeTemplate,
  setActiveTemplate,
  updateTemplate,
  type MessageTemplate,
} from '@/domain/settings'
import { cn } from '@/lib/utils'
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

type Draft = Pick<MessageTemplate, 'name' | 'body'>

const toDraft = ({ name, body }: MessageTemplate): Draft => ({ name, body })

export function SettingsPage() {
  const { settings: settingsRepository } = useDependencies()
  const settings = useSettings()
  const active = activeTemplate(settings)
  const [selectedId, setSelectedId] = useState(active.id)
  const selected = settings.messageTemplates.find((template) => template.id === selectedId) ?? active
  const [draft, setDraft] = useState<Draft>(() => toDraft(selected))
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isDirty = draft.name !== selected.name || draft.body !== selected.body
  const isActive = selected.id === active.id

  /** Troca o modelo em edição; pergunta antes de jogar fora alterações não salvas. */
  const select = (template: MessageTemplate) => {
    if (template.id === selected.id) return
    if (isDirty && !window.confirm('Descartar as alterações não salvas deste modelo?')) return
    setSelectedId(template.id)
    setDraft(toDraft(template))
  }

  const create = () => {
    if (isDirty && !window.confirm('Descartar as alterações não salvas deste modelo?')) return
    const template: MessageTemplate = { id: crypto.randomUUID(), name: `Modelo ${settings.messageTemplates.length + 1}`, body: '' }
    settingsRepository.save(addTemplate(settings, template))
    setSelectedId(template.id)
    setDraft(toDraft(template))
    requestAnimationFrame(() => textareaRef.current?.focus())
  }

  const save = () => {
    settingsRepository.save(updateTemplate(settings, selected.id, { name: draft.name.trim() || selected.name, body: draft.body }))
    toast.success('Modelo salvo')
  }

  const use = (template: MessageTemplate) => {
    settingsRepository.save(setActiveTemplate(settings, template.id))
    toast.success(`"${template.name}" é a mensagem em uso`)
  }

  const remove = () => {
    if (!window.confirm(`Excluir o modelo "${selected.name}"?`)) return
    const next = removeTemplate(settings, selected.id)
    settingsRepository.save(next)
    const fallback = activeTemplate(next)
    setSelectedId(fallback.id)
    setDraft(toDraft(fallback))
  }

  /** Insere a variável onde está o cursor, em vez de jogar no fim do texto. */
  const insertPlaceholder = (placeholder: string) => {
    const textarea = textareaRef.current
    const start = textarea?.selectionStart ?? draft.body.length
    const end = textarea?.selectionEnd ?? draft.body.length
    setDraft({ ...draft, body: draft.body.slice(0, start) + placeholder + draft.body.slice(end) })
    requestAnimationFrame(() => {
      textarea?.focus()
      textarea?.setSelectionRange(start + placeholder.length, start + placeholder.length)
    })
  }

  return (
    <>
      <PageHeader
        title="Mensagens"
        description="Modelos de texto que já vão escritos quando você abre o WhatsApp de um lead. Mensagens curtas e pessoais têm mais respostas."
        actions={
          <Button icon={Plus} onClick={create} disabled={!canAddTemplate(settings)}>
            Novo modelo
          </Button>
        }
      />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Panel
            title="Modelos"
            action={
              <span className="text-data text-ink-muted">
                {settings.messageTemplates.length}/{MAX_MESSAGE_TEMPLATES}
              </span>
            }
            bodyClassName="p-1"
          >
            <ul>
              {settings.messageTemplates.map((template) => (
                <li
                  key={template.id}
                  className={cn('flex items-center gap-3 rounded-md pr-2 pl-3', template.id === selected.id && 'bg-surface-hover')}
                >
                  <button
                    type="button"
                    onClick={() => select(template)}
                    aria-current={template.id === selected.id || undefined}
                    className="min-w-0 flex-1 cursor-pointer py-2.5 text-left"
                  >
                    <span className="block truncate font-medium">{template.name}</span>
                    <span className="block truncate text-caption text-ink-muted">{template.body || 'Sem texto'}</span>
                  </button>
                  {template.id === active.id ? (
                    <span className="inline-flex items-center gap-1 text-[13px] font-medium whitespace-nowrap text-sucesso">
                      <Check className="size-4" />
                      Em uso
                    </span>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => use(template)}>
                      Usar
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </Panel>
          <Input
            aria-label="Nome do modelo"
            placeholder="Nome do modelo"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="w-full"
          />
          <div className="overflow-hidden rounded-lg border border-line-strong bg-surface focus-within:shadow-[var(--focus-ring)]">
            <label htmlFor="template" className="sr-only">
              Texto da mensagem
            </label>
            <textarea
              id="template"
              ref={textareaRef}
              rows={12}
              value={draft.body}
              placeholder="Escreva a mensagem. Use as variáveis abaixo para personalizar."
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              data-focus-inner
              className="block min-h-64 w-full resize-none bg-transparent p-4 leading-relaxed outline-none placeholder:text-ink-muted"
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
              <span className="ml-auto text-data text-ink-muted">{formatCount(draft.body.length)} caracteres</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={save} disabled={!isDirty}>
              Salvar modelo
            </Button>
            {!isActive && (
              <Button icon={Check} onClick={() => use(selected)}>
                Usar esta mensagem
              </Button>
            )}
            <Button variant="ghost" icon={RotateCcw} onClick={() => setDraft({ ...draft, body: DEFAULT_MESSAGE_TEMPLATE })}>
              Restaurar padrão
            </Button>
            <Button
              variant="ghost"
              icon={Trash2}
              onClick={remove}
              disabled={settings.messageTemplates.length === 1}
              className="ml-auto hover:text-perigo"
            >
              Excluir
            </Button>
          </div>
        </div>
        <Panel title="Prévia" bodyClassName="bg-surface-sunken rounded-b-lg">
          <p className="mb-3 text-caption text-ink-muted">Como chega para {SAMPLE_LEAD.name}</p>
          {/* Balão de mensagem enviada nas cores do WhatsApp, para a prévia parecer o que o lead vai ver. */}
          <div className="ml-auto max-w-[85%] rounded-lg rounded-tr-sm bg-whatsapp-bubble px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap text-on-whatsapp-bubble">
            {renderMessage(draft.body, SAMPLE_LEAD) || <span className="opacity-60">Sem texto</span>}
          </div>
        </Panel>
      </div>
      <p className="text-caption text-ink-muted">Envie uma mensagem por vez. Disparo em massa pode banir seu número e esbarrar na LGPD.</p>
    </>
  )
}
