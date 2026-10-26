import { ArrowUpRight, History } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { leadsOfSearch } from '@/app/routes'
import type { Search } from '@/domain/search'
import { formatCount, formatDuration } from '@/presentation/format'
import { useNow } from '@/presentation/hooks/use-now'
import { SearchStatus } from '@/presentation/components/search-status'

/** O motor não informa progresso; estimamos pelo tempo decorrido sobre o tempo máximo do job. */
const MAX_ESTIMATED_PROGRESS = 95

function estimateProgress(search: Search, now: number): number {
  const elapsedSeconds = (now - Date.parse(search.createdAt)) / 1000
  return Math.min(MAX_ESTIMATED_PROGRESS, (elapsedSeconds / search.maxTimeSeconds) * 100)
}

function elapsedSeconds(search: Search, now: number): number {
  const end = search.finishedAt ? Date.parse(search.finishedAt) : now
  return Math.max(0, Math.round((end - Date.parse(search.createdAt)) / 1000))
}

function Row({ search, now, trailing }: { search: Search; now: number; trailing: ReactNode }) {
  return (
    <>
      <div className="flex items-center gap-3">
        <History className="mt-0.5 size-4 shrink-0 self-start text-ink-muted" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{search.keyword}</p>
          <p className="text-data text-ink-muted">
            {search.status === 'ok' && `${formatCount(search.leadCount)} leads · `}
            {formatDuration(elapsedSeconds(search, now))}
          </p>
        </div>
        {trailing}
      </div>
      {search.status === 'working' && (
        <div className="mt-2 ml-7 h-1 overflow-hidden rounded-full bg-surface-sunken">
          <div className="h-full bg-ink transition-[width] duration-1000" style={{ width: `${estimateProgress(search, now)}%` }} />
        </div>
      )}
    </>
  )
}

export function SearchProgressItem({ search }: { readonly search: Search }) {
  const now = useNow()
  const className = 'group block rounded-md px-3 py-2.5 transition-colors hover:bg-surface-hover'

  return (
    <li>
      {search.status === 'ok' ? (
        <Link to={leadsOfSearch(search.id)} className={className}>
          <Row search={search} now={now} trailing={<ArrowUpRight className="size-4 shrink-0 text-ink-faint group-hover:text-ink" />} />
        </Link>
      ) : (
        <div className={className}>
          <Row search={search} now={now} trailing={<SearchStatus status={search.status} />} />
        </div>
      )}
    </li>
  )
}
