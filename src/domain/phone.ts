const BRAZIL_COUNTRY_CODE = '55'

export interface PhoneInfo {
  /** Somente dígitos, já com DDI quando for número brasileiro. */
  readonly digits: string
  /** Celular brasileiro (DDD + 9 + 8 dígitos): o canal mais provável de ter WhatsApp. */
  readonly isMobile: boolean
}

export function parsePhone(raw: string): PhoneInfo | null {
  const digits = raw.replace(/\D/g, '')
  if (digits.length < 8) return null

  const withCountryCode = digits.length === 10 || digits.length === 11 ? BRAZIL_COUNTRY_CODE + digits : digits
  const national = withCountryCode.startsWith(BRAZIL_COUNTRY_CODE) ? withCountryCode.slice(2) : ''
  const isMobile = national.length === 11 && national[2] === '9'

  return { digits: withCountryCode, isMobile }
}

/**
 * Usa api.whatsapp.com direto: o redirecionamento do wa.me troca emojis fora do BMP (👉, 🚀…) por "�".
 */
export function buildWhatsAppUrl(phone: PhoneInfo, message: string): string {
  return `https://api.whatsapp.com/send?phone=${phone.digits}&text=${encodeURIComponent(message)}`
}
