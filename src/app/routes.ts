export const ROUTES = {
  search: '/',
  leads: '/leads',
  sitePrompt: '/leads/:leadId/prompt-do-site',
  map: '/mapa',
  history: '/buscas',
  settings: '/config',
} as const

export const leadsOfSearch = (searchId: string) => `${ROUTES.leads}?busca=${encodeURIComponent(searchId)}`

/** Abre o detalhe do lead na tela de Leads. */
export const leadDetail = (leadId: string) => `${ROUTES.leads}?lead=${encodeURIComponent(leadId)}`

/** Prompt para uma IA criar o site do lead. */
export const sitePrompt = (leadId: string) => `${ROUTES.leads}/${encodeURIComponent(leadId)}/prompt-do-site`
