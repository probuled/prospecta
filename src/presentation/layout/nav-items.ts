import { History, MessageSquare, Search, Users, type LucideIcon } from 'lucide-react'
import { ROUTES } from '@/app/routes'

export interface NavItem {
  readonly to: string
  readonly label: string
  readonly icon: LucideIcon
}

export const NAV_ITEMS: readonly NavItem[] = [
  { to: ROUTES.search, label: 'Buscar', icon: Search },
  { to: ROUTES.leads, label: 'Leads', icon: Users },
  { to: ROUTES.history, label: 'Histórico', icon: History },
  { to: ROUTES.settings, label: 'Mensagem', icon: MessageSquare },
]
