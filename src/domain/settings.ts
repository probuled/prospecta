import { DEFAULT_MESSAGE_TEMPLATE } from './message-template'

export const MAX_MESSAGE_TEMPLATES = 10

export interface MessageTemplate {
  readonly id: string
  readonly name: string
  readonly body: string
}

export interface Settings {
  readonly messageTemplates: readonly MessageTemplate[]
  /** Modelo usado ao abrir o WhatsApp de um lead. */
  readonly activeTemplateId: string
}

const DEFAULT_TEMPLATE: MessageTemplate = { id: 'padrao', name: 'Sem site próprio', body: DEFAULT_MESSAGE_TEMPLATE }

export const DEFAULT_SETTINGS: Settings = {
  messageTemplates: [DEFAULT_TEMPLATE],
  activeTemplateId: DEFAULT_TEMPLATE.id,
}

/** O modelo ativo; se o id ficou órfão, cai no primeiro da lista. */
export function activeTemplate(settings: Settings): MessageTemplate {
  return (
    settings.messageTemplates.find((template) => template.id === settings.activeTemplateId) ??
    settings.messageTemplates[0] ??
    DEFAULT_TEMPLATE
  )
}

export function canAddTemplate(settings: Settings): boolean {
  return settings.messageTemplates.length < MAX_MESSAGE_TEMPLATES
}

export function addTemplate(settings: Settings, template: MessageTemplate): Settings {
  if (!canAddTemplate(settings)) return settings
  return { ...settings, messageTemplates: [...settings.messageTemplates, template] }
}

export function updateTemplate(settings: Settings, id: string, patch: Partial<Omit<MessageTemplate, 'id'>>): Settings {
  return {
    ...settings,
    messageTemplates: settings.messageTemplates.map((template) => (template.id === id ? { ...template, ...patch } : template)),
  }
}

/** Sempre sobra pelo menos um modelo; removendo o ativo, o primeiro restante assume. */
export function removeTemplate(settings: Settings, id: string): Settings {
  const messageTemplates = settings.messageTemplates.filter((template) => template.id !== id)
  if (messageTemplates.length === 0) return settings
  const activeTemplateId = settings.activeTemplateId === id ? messageTemplates[0].id : settings.activeTemplateId
  return { messageTemplates, activeTemplateId }
}

export function setActiveTemplate(settings: Settings, id: string): Settings {
  if (!settings.messageTemplates.some((template) => template.id === id)) return settings
  return { ...settings, activeTemplateId: id }
}

/** Converte o formato antigo (`{ messageTemplate: string }`, um único modelo) para a lista de modelos. */
export function migrateSettings(raw: unknown): Settings | null {
  if (typeof raw !== 'object' || raw === null || 'messageTemplates' in raw) return null
  const legacy = (raw as { messageTemplate?: unknown }).messageTemplate
  if (typeof legacy !== 'string') return DEFAULT_SETTINGS
  return { messageTemplates: [{ ...DEFAULT_TEMPLATE, name: 'Minha mensagem', body: legacy }], activeTemplateId: DEFAULT_TEMPLATE.id }
}
