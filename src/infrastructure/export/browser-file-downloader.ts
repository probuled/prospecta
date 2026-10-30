import type { FileDownloader } from '@/application/ports/file-downloader'
import { downloadFile } from './download-file'

export class BrowserFileDownloader implements FileDownloader {
  downloadText(content: string, fileName: string, mimeType: string): void {
    downloadFile(new Blob([content], { type: `${mimeType};charset=utf-8` }), fileName)
  }
}
