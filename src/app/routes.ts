export const ROUTES = {
  search: '/',
  leads: '/leads',
  history: '/buscas',
  settings: '/config',
} as const

export const leadsOfSearch = (searchId: string) => `${ROUTES.leads}?busca=${encodeURIComponent(searchId)}`
