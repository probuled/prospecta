import { NavLink } from 'react-router'
import { Logo } from '@/components/prospecta/logo'
import { cn } from '@/lib/utils'
import type { EngineStatus as Status } from '@/presentation/hooks/use-engine-status'
import { EngineStatusMark } from './engine-status'
import { NAV_ITEMS } from './nav-items'
import { ThemeControl } from './theme-control'

export function MobileTopBar({ engineStatus }: { readonly engineStatus: Status }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-bg px-4 lg:hidden">
      <Logo height={26} />
      <div className="flex items-center gap-3">
        <EngineStatusMark status={engineStatus} />
        <ThemeControl />
      </div>
    </header>
  )
}

export function MobileBottomNav() {
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-bg pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            cn(
              'flex h-14 flex-col items-center justify-center gap-1 text-xs font-medium text-ink-muted',
              isActive && 'text-ink [&_svg]:text-ouro-text',
            )
          }
        >
          <Icon className="size-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
