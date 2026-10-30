import { describe, expect, it } from 'vitest'
import { InvalidBackupError } from '@/application/ports/backup-file'
import { makeLead, makeProfile } from '@/domain/__tests__/fixtures'
import { createBackup } from '@/domain/backup'
import { DEFAULT_SETTINGS } from '@/domain/settings'
import { JsonBackupFile } from '../json-backup-file'

const fileOf = (content: unknown) => new File([typeof content === 'string' ? content : JSON.stringify(content)], 'backup.json')

const backup = createBackup(
  {
    leads: [makeLead({ profile: makeProfile({ neighborhood: 'Janga' }), location: { lat: -7.9, lon: -34.8 } })],
    searches: [],
    settings: DEFAULT_SETTINGS,
  },
  new Date('2026-10-30T12:00:00.000Z'),
)

describe('JsonBackupFile.read', () => {
  it('lê o backup que o próprio app gerou', async () => {
    await expect(new JsonBackupFile().read(fileOf(backup))).resolves.toEqual(backup)
  })

  it('migra status e configurações de versões antigas', async () => {
    const legacy = { ...backup, leads: [{ ...backup.leads[0], status: 'descartado' }], settings: { messageTemplate: 'Oi {nome}' } }
    const restored = await new JsonBackupFile().read(fileOf(legacy))
    expect(restored.leads[0].status).toBe('perdido')
    expect(restored.settings.messageTemplates[0].body).toBe('Oi {nome}')
  })

  it('recusa arquivo que não é JSON ou não é backup do Prospecta', async () => {
    await expect(new JsonBackupFile().read(fileOf('{quebrado'))).rejects.toBeInstanceOf(InvalidBackupError)
    await expect(new JsonBackupFile().read(fileOf({ leads: [] }))).rejects.toThrow('não é um backup do Prospecta')
    await expect(new JsonBackupFile().read(fileOf({ ...backup, leads: [{ id: 'x' }] }))).rejects.toBeInstanceOf(InvalidBackupError)
  })
})
