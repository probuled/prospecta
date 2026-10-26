import { ArrowUpRight, History, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { useDependencies } from '@/app/dependencies-context'
import { leadsOfSearch, ROUTES } from '@/app/routes'
import { Button, ButtonLink } from '@/components/prospecta/button'
import { EmptyState } from '@/components/prospecta/empty-state'
import { PageHeader } from '@/components/prospecta/page-header'
import type { Search } from '@/domain/search'
import { SearchStatus } from '@/presentation/components/search-status'
import { formatCount } from '@/presentation/format'
import { useSearches } from '@/presentation/hooks/use-store'
import { DeleteSearchDialog } from './delete-search-dialog'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })

function SearchRow({ search, onDelete }: { readonly search: Search; readonly onDelete: (search: Search) => void }) {
  const title = (
    <div className="min-w-0">
      <p className="truncate font-medium">{search.keyword}</p>
      <p className="text-caption text-ink-muted">
        <span className="font-mono">{dateFormatter.format(new Date(search.createdAt))}</span> · profundidade {search.depth}
        {search.withEmails ? ' · com e-mails' : ''}
      </p>
    </div>
  )

  return (
    <li className="group flex h-[var(--row-height)] items-center gap-4 border-b border-line px-4 transition-colors last:border-b-0 hover:bg-surface-hover">
      {search.status === 'ok' ? (
        <Link to={leadsOfSearch(search.id)} className="flex min-w-0 flex-1 items-center gap-2 rounded-sm">
          {title}
          <ArrowUpRight className="size-4 shrink-0 text-ink-faint group-hover:text-ink" />
        </Link>
      ) : (
        <div className="min-w-0 flex-1">{title}</div>
      )}
      <span className="hidden text-data sm:block">
        {formatCount(search.leadCount)} <span className="font-sans text-caption text-ink-muted">leads</span>
      </span>
      <span className="w-24">
        <SearchStatus status={search.status} />
      </span>
      <Button variant="ghost" size="sm" iconOnly icon={Trash2} onClick={() => onDelete(search)} aria-label={`Excluir busca ${search.keyword}`} />
    </li>
  )
}

export function HistoryPage() {
  const { deleteSearch } = useDependencies()
  const searches = useSearches()
  const [pendingDelete, setPendingDelete] = useState<Search | null>(null)

  const confirmDelete = async (search: Search, removeLeads: boolean) => {
    setPendingDelete(null)
    await deleteSearch.execute(search.id, { removeLeads })
    toast.success('Busca excluída')
  }

  return (
    <>
      <PageHeader title="Histórico" description="Todas as buscas feitas. Abra uma busca para ver os leads dela." />
      {searches.length === 0 ? (
        <EmptyState
          icon={History}
          title="Nenhuma busca ainda."
          description="Cada nicho que você buscar aparece aqui."
          action={
            <ButtonLink to={ROUTES.search} variant="primary">
              Buscar leads
            </ButtonLink>
          }
        />
      ) : (
        <ul className="overflow-hidden rounded-lg border border-line bg-surface">
          {searches.map((search) => (
            <SearchRow key={search.id} search={search} onDelete={setPendingDelete} />
          ))}
        </ul>
      )}
      <DeleteSearchDialog search={pendingDelete} onCancel={() => setPendingDelete(null)} onConfirm={confirmDelete} />
    </>
  )
}
