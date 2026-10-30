export interface FileDownloader {
  /** Baixa um texto como arquivo (prompt em .md, por exemplo). */
  downloadText(content: string, fileName: string, mimeType: string): void
}
