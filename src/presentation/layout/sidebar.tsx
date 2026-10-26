import { NavLink } from 'react-router'
import { Logo } from '@/components/prospecta/logo'
import { cn } from '@/lib/utils'
import type { EngineStatus as Status } from '@/presentation/hooks/use-engine-status'
import { EngineStatus } from './engine-status'
import { NAV_ITEMS } from './nav-items'
import { ThemeControl } from './theme-control'

interface SidebarProps {
  readonly engineStatus: Status
  readonly counts: Partial<Record<string, number>>
}

export function Sidebar({ engineStatus, counts }: SidebarProps) {
  return (
    <aside className="sticky top-0 hidden h-svh w-[var(--sidebar-width)] shrink-0 flex-col border-r border-line bg-bg px-3 pt-5 pb-3 lg:flex">
      <div className="flex justify-center px-2 pb-6">
        <Logo height={48} />
      </div>

      <nav aria-label="Principal" className="flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              cn(
                'group flex h-9 items-center gap-3 rounded-md pr-2 pl-2.5 font-medium text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink',
                isActive && 'bg-surface text-ink shadow-[0_0_0_1px_var(--line)] hover:bg-surface',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn('size-[17px]', isActive && 'text-ouro-text')} />
                <span className="flex-1">{label}</span>
                {counts[to] ? <span className="font-mono text-xs font-normal text-ink-muted tabular-nums">{counts[to]}</span> : null}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3 border-t border-line pt-3">
        <EngineStatus status={engineStatus} />
        <ThemeControl block />
      </div>
    </aside>
  )
}
