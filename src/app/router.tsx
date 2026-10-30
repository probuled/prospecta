import { createBrowserRouter } from 'react-router'
import { ROUTES } from './routes'
import { RouteError } from '@/presentation/components/route-error'
import { AppLayout } from '@/presentation/layout/app-layout'
import { HistoryPage } from '@/presentation/pages/history/history-page'
import { LeadsPage } from '@/presentation/pages/leads/leads-page'
import { SearchPage } from '@/presentation/pages/search/search-page'
import { SettingsPage } from '@/presentation/pages/settings/settings-page'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <RouteError />,
    children: [
      { path: ROUTES.search, element: <SearchPage /> },
      { path: ROUTES.leads, element: <LeadsPage /> },
      {
        path: ROUTES.sitePrompt,
        lazy: async () => ({ Component: (await import('@/presentation/pages/site-prompt/site-prompt-page')).SitePromptPage }),
      },
      {
        path: ROUTES.map,
        lazy: async () => ({ Component: (await import('@/presentation/pages/map/map-page')).MapPage }),
      },
      { path: ROUTES.history, element: <HistoryPage /> },
      { path: ROUTES.settings, element: <SettingsPage /> },
      // Endereço desconhecido: 404 dentro do layout, com o menu.
      {
        path: '*',
        lazy: async () => ({ Component: (await import('@/presentation/pages/not-found/not-found-page')).NotFoundPage }),
      },
    ],
  },
])
