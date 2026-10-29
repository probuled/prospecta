export const ROUTES = {
  search: '/',
  leads: '/leads',
  map: '/mapa',
  history: '/buscas',
  settings: '/config',
} as const

export const leadsOfSearch = (searchId: string) => `${ROUTES.leads}?busca=${encodeURIComponent(searchId)}`

/** Abre o detalhe do lead na tela de Leads. */
export const leadDetail = (leadId: string) => `${ROUTES.leads}?lead=${encodeURIComponent(leadId)}`
