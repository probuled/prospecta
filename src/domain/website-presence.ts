export type WebsitePresence = 'none' | 'social' | 'own'

export const WEBSITE_PRESENCE_LABELS: Record<WebsitePresence, string> = {
  none: 'Sem site',
  social: 'Só rede social',
  own: 'Tem site',
}

/** Domínios que não contam como "site próprio": redes sociais, agregadores de link e marketplaces. */
const NON_OWNED_HOSTS = [
  'instagram.com',
  'facebook.com',
  'fb.com',
  'linktr.ee',
  'linktree.com',
  'wa.me',
  'whatsapp.com',
  'tiktok.com',
  'linkedin.com',
  'youtube.com',
  'twitter.com',
  'x.com',
  'bio.site',
  'beacons.ai',
  'ifood.com.br',
  'goomer.app',
  'anota.ai',
  'sites.google.com',
  'business.site',
  'g.page',
]

function hostnameOf(url: string): string | null {
  try {
    const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`
    return new URL(normalized).hostname.toLowerCase().replace(/^www\./, '')
  } catch {
    return null
  }
}

export function classifyWebsite(website: string): WebsitePresence {
  if (!website.trim()) return 'none'

  const host = hostnameOf(website)
  if (!host) return 'none'

  const isNonOwned = NON_OWNED_HOSTS.some((domain) => host === domain || host.endsWith(`.${domain}`))
  return isNonOwned ? 'social' : 'own'
}
