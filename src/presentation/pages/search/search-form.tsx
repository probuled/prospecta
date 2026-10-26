import { SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { Disclosure } from '@/components/prospecta/disclosure'
import { SearchBar } from '@/components/prospecta/search-bar'
import { SegmentedControl, type SegmentOption } from '@/components/prospecta/segmented-control'
import { Switch } from '@/components/prospecta/switch'
import { TagList } from '@/components/prospecta/tag-list'
import { DEFAULT_RESULT_COUNT, depthForResultCount, RESULT_COUNT_OPTIONS, type SearchRequest } from '@/domain/search'
import { NICHE_SUGGESTIONS } from './niche-suggestions'

interface SearchFormProps {
  readonly disabled: boolean
  readonly onSubmit: (request: SearchRequest) => Promise<void>
}

type ResultCount = `${(typeof RESULT_COUNT_OPTIONS)[number]}`

const COUNT_OPTIONS: readonly SegmentOption<ResultCount>[] = RESULT_COUNT_OPTIONS.map((count) => ({
  value: `${count}`,
  label: `${count}`,
}))

export function SearchForm({ disabled, onSubmit }: SearchFormProps) {
  const [niche, setNiche] = useState('')
  const [city, setCity] = useState('')
  const [resultCount, setResultCount] = useState<ResultCount>(`${DEFAULT_RESULT_COUNT}`)
  const [withEmails, setWithEmails] = useState(true)
  const [busy, setBusy] = useState(false)

  const canSubmit = !disabled && niche.trim() !== '' && city.trim() !== ''

  const submit = async () => {
    if (!canSubmit || busy) return
    setBusy(true)
    try {
      await onSubmit({ niche, city, depth: depthForResultCount(Number(resultCount)), withEmails })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <SearchBar
        niche={niche}
        city={city}
        onNicheChange={setNiche}
        onCityChange={setCity}
        onSubmit={submit}
        busy={busy}
        disabled={!canSubmit}
      />
      <TagList label="Sugestões" items={NICHE_SUGGESTIONS} selected={niche} onSelect={setNiche} className="justify-center" />
      <Disclosure
        title="Opções avançadas"
        icon={SlidersHorizontal}
        summary={`~${resultCount} negócios · ${withEmails ? 'com e-mails' : 'sem e-mails'}`}
        defaultOpen
      >
        <div className="flex flex-col items-start gap-2">
          <span aria-hidden className="font-medium">
            Quantidade de negócios
          </span>
          <SegmentedControl
            label="Quantidade de negócios"
            options={COUNT_OPTIONS}
            value={resultCount}
            onChange={setResultCount}
            className="font-mono"
          />
          <p className="text-caption text-ink-muted">Mais negócios, busca mais demorada.</p>
        </div>
        <Switch
          title="Coletar e-mails"
          description="Inclui o e-mail do negócio quando encontrado."
          checked={withEmails}
          onChange={setWithEmails}
        />
      </Disclosure>
    </div>
  )
}
