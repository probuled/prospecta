import type { BackupFile } from '@/application/ports/backup-file'
import type { LeadRepository, SearchRepository, SettingsRepository } from '@/application/ports/repositories'
import { createBackup, mergeBackup, type RestoreSummary } from '@/domain/backup'

/** Baixa e restaura o backup completo: leads (com etapa, notas e valor), buscas e modelos de mensagem. */
export class BackupData {
  private readonly file: BackupFile
  private readonly leads: LeadRepository
  private readonly searches: SearchRepository
  private readonly settings: SettingsRepository

  constructor(file: BackupFile, leads: LeadRepository, searches: SearchRepository, settings: SettingsRepository) {
    this.file = file
    this.leads = leads
    this.searches = searches
    this.settings = settings
  }

  download(now = new Date()): void {
    const backup = createBackup(this.current(), now)
    this.file.download(backup, `prospecta-backup-${now.toISOString().slice(0, 10)}.json`)
  }

  async restore(file: File): Promise<RestoreSummary> {
    const { data, summary } = mergeBackup(this.current(), await this.file.read(file))
    this.leads.replaceAll(data.leads)
    this.searches.replaceAll(data.searches)
    this.settings.save(data.settings)
    return summary
  }

  private current() {
    return { leads: this.leads.getSnapshot(), searches: this.searches.getSnapshot(), settings: this.settings.getSnapshot() }
  }
}
