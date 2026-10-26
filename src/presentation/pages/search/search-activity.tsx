import { ROUTES } from '@/app/routes'
import { ButtonLink } from '@/components/prospecta/button'
import { Panel } from '@/components/prospecta/panel'
import type { Search } from '@/domain/search'
import { SearchProgressItem } from './search-progress-item'

const RECENT_LIMIT = 6

const HOW_IT_WORKS = [
  { title: 'Escolha nicho e cidade', text: 'Negócios locais pouco digitalizados rendem mais leads sem site.' },
  { title: 'O motor varre o Google Maps', text: 'Leva alguns minutos. Você pode usar o app enquanto isso.' },
  { title: 'Aborde por oportunidade', text: 'Quem não tem site e é bem avaliado aparece primeiro.' },
]

function HowItWorks() {
  return (
    <ol className="space-y-4">
      {HOW_IT_WORKS.map((step, index) => (
        <li key={step.title} className="flex gap-3">
          <span className="text-data font-medium text-ink-muted">{index + 1}</span>
          <div>
            <p className="font-medium">{step.title}</p>
            <p className="text-caption text-ink-muted">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

export function SearchActivity({ searches }: { readonly searches: readonly Search[] }) {
  const recent = searches.slice(0, RECENT_LIMIT)

  return (
    <Panel
      title={recent.length ? 'Atividade recente' : 'Como funciona'}
      action={
        searches.length > RECENT_LIMIT && (
          <ButtonLink to={ROUTES.history} variant="ghost" size="sm">
            Ver tudo
          </ButtonLink>
        )
      }
      bodyClassName={recent.length ? 'p-2' : undefined}
      className="lg:sticky lg:top-12"
    >
      {recent.length ? (
        <ul>
          {recent.map((search) => (
            <SearchProgressItem key={search.id} search={search} />
          ))}
        </ul>
      ) : (
        <HowItWorks />
      )}
    </Panel>
  )
}
