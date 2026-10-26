export interface InstagramProfile {
  /** Link para abrir o perfil. */
  readonly url: string
  /** Usuário sem o "@". Nulo quando o link aponta para um post, não para o perfil. */
  readonly handle: string | null
}

const INSTAGRAM_HOST = /^(?:[a-z0-9-]+\.)*instagram\.com$/i

/** Caminhos do Instagram que não são nome de usuário. */
const RESERVED_PATHS = new Set(['p', 'reel', 'reels', 'tv', 'stories', 'explore', 'accounts', 'direct', 'about', 'legal'])

const HANDLE_PATTERN = /^[a-z0-9._]{1,30}$/i

/**
 * O motor não traz redes sociais à parte: o Instagram aparece no campo de site do Google Maps.
 * Retorna o perfil quando o site do negócio é um link do Instagram.
 */
export function findInstagram(website: string): InstagramProfile | null {
  const trimmed = website.trim()
  if (!trimmed) return null

  let url: URL
  try {
    url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`)
  } catch {
    return null
  }
  if (!INSTAGRAM_HOST.test(url.hostname)) return null

  const [first = ''] = url.pathname.split('/').filter(Boolean)
  const isProfile = HANDLE_PATTERN.test(first) && !RESERVED_PATHS.has(first.toLowerCase())
  if (!isProfile) return { url: url.href, handle: null }

  return { url: `https://www.instagram.com/${first}/`, handle: first }
}
