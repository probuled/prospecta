import { useEffect, useState } from 'react'

const COPIED_FEEDBACK_MS = 2_000

/** Copia texto e mantém `isCopied` ligado por 2 segundos, para o botão confirmar a ação. */
export function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (!isCopied) return
    const timer = setTimeout(() => setIsCopied(false), COPIED_FEEDBACK_MS)
    return () => clearTimeout(timer)
  }, [isCopied])

  const copy = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      return true
    } catch {
      // Sem permissão ou fora de HTTPS/localhost: quem chama mostra o erro.
      return false
    }
  }

  return { copy, isCopied }
}
