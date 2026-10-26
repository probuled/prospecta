import { describe, expect, it } from 'vitest'
import {
  activeTemplate,
  addTemplate,
  DEFAULT_SETTINGS,
  MAX_MESSAGE_TEMPLATES,
  migrateSettings,
  removeTemplate,
  setActiveTemplate,
  type Settings,
} from '../settings'

const template = (id: string) => ({ id, name: `Modelo ${id}`, body: `Texto ${id}` })

const settingsWith = (...ids: string[]): Settings => ({ messageTemplates: ids.map(template), activeTemplateId: ids[0] })

describe('modelos de mensagem', () => {
  it('não passa do limite de modelos', () => {
    const ids = Array.from({ length: MAX_MESSAGE_TEMPLATES }, (_, i) => String(i))
    const full = settingsWith(...ids)
    expect(addTemplate(full, template('extra'))).toBe(full)
  })

  it('removendo o ativo, o primeiro restante assume', () => {
    const settings = removeTemplate(settingsWith('a', 'b'), 'a')
    expect(activeTemplate(settings).id).toBe('b')
  })

  it('não remove o último modelo', () => {
    const settings = settingsWith('a')
    expect(removeTemplate(settings, 'a')).toBe(settings)
  })

  it('ignora ativar um modelo inexistente', () => {
    const settings = settingsWith('a', 'b')
    expect(setActiveTemplate(settings, 'x')).toBe(settings)
    expect(setActiveTemplate(settings, 'b').activeTemplateId).toBe('b')
  })
})

describe('migrateSettings', () => {
  it('converte o modelo único antigo em lista', () => {
    const migrated = migrateSettings({ messageTemplate: 'Oi {nome}' })
    expect(migrated?.messageTemplates).toHaveLength(1)
    expect(migrated && activeTemplate(migrated).body).toBe('Oi {nome}')
  })

  it('não mexe no formato atual', () => {
    expect(migrateSettings(DEFAULT_SETTINGS)).toBeNull()
  })
})
