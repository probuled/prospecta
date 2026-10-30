/** Baixa o conteúdo como arquivo, sem sair da página. */
export function downloadFile(content: Blob | string, fileName: string): void {
  const isDataUrl = typeof content === 'string'
  const href = isDataUrl ? content : URL.createObjectURL(content)
  Object.assign(document.createElement('a'), { href, download: fileName }).click()
  if (!isDataUrl) URL.revokeObjectURL(href)
}
