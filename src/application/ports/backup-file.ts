import type { Backup } from '@/domain/backup'

export interface BackupFile {
  download(backup: Backup, fileName: string): void
  /** Lê e valida o arquivo. Rejeita com `InvalidBackupError` se não for um backup do Prospecta. */
  read(file: File): Promise<Backup>
}

export class InvalidBackupError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidBackupError'
  }
}
