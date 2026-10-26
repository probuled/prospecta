import { createBrowserRouter } from 'react-router'
import { ROUTES } from './routes'
import { AppLayout } from '@/presentation/layout/app-layout'
import { HistoryPage } from '@/presentation/pages/history/history-page'
import { LeadsPage } from '@/presentation/pages/leads/leads-page'
import { SearchPage } from '@/presentation/pages/search/search-page'
import { SettingsPage } from '@/presentation/pages/settings/settings-page'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: ROUTES.search, element: <SearchPage /> },
      { path: ROUTES.leads, element: <LeadsPage /> },
      { path: ROUTES.history, element: <HistoryPage /> },
      { path: ROUTES.settings, element: <SettingsPage /> },
    ],
  },
])
