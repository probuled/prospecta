import { InvalidBackupError, type BackupFile } from '@/application/ports/backup-file'
import type { Backup } from '@/domain/backup'
import { downloadFile } from '@/infrastructure/export/download-file'
import { backupSchema } from './backup-schema'

export class JsonBackupFile implements BackupFile {
  download(backup: Backup, fileName: string): void {
    downloadFile(new Blob([JSON.stringify(backup)], { type: 'application/json' }), fileName)
  }

  async read(file: File): Promise<Backup> {
    let raw: unknown
    try {
      raw = JSON.parse(await file.text())
    } catch {
      throw new InvalidBackupError('O arquivo não é um JSON válido. Escolha o backup baixado pelo Prospecta.')
    }
    const result = backupSchema.safeParse(raw)
    if (!result.success) {
      throw new InvalidBackupError('Este arquivo não é um backup do Prospecta ou está corrompido.')
    }
    return result.data
  }
}
