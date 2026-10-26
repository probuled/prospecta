import { SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { Disclosure } from '@/components/prospecta/disclosure'
import { SearchBar } from '@/components/prospecta/search-bar'
import { Slider } from '@/components/prospecta/slider'
import { Switch } from '@/components/prospecta/switch'
import { TagList } from '@/components/prospecta/tag-list'
import { DEPTH_LIMITS, type SearchRequest } from '@/domain/search'
import { NICHE_SUGGESTIONS } from './niche-suggestions'

interface SearchFormProps {
  readonly disabled: boolean
  readonly onSubmit: (request: SearchRequest) => Promise<void>
}

/** Cada nível de profundidade rola a lista do Maps e traz, em média, uns 6 negócios a mais. */
const RESULTS_PER_DEPTH = 6

export function SearchForm({ disabled, onSubmit }: SearchFormProps) {
  const [niche, setNiche] = useState('')
  const [city, setCity] = useState('')
  const [depth, setDepth] = useState<number>(DEPTH_LIMITS.default)
  const [withEmails, setWithEmails] = useState(true)
  const [busy, setBusy] = useState(false)

  const canSubmit = !disabled && niche.trim() !== '' && city.trim() !== ''
  const estimate = `~${depth * RESULTS_PER_DEPTH} negócios`

  const submit = async () => {
    if (!canSubmit || busy) return
    setBusy(true)
    try {
      await onSubmit({ niche, city, depth, withEmails })
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
      <TagList label="Sugestões" items={NICHE_SUGGESTIONS} selected={niche} onSelect={setNiche} />
      <Disclosure title="Opções avançadas" icon={SlidersHorizontal} summary={`${estimate} · ${withEmails ? 'com e-mails' : 'sem e-mails'}`}>
        <Slider
          label="Profundidade"
          min={DEPTH_LIMITS.min}
          max={DEPTH_LIMITS.max}
          value={depth}
          onChange={setDepth}
          format={(value) => `${value} · ${`~${value * RESULTS_PER_DEPTH}`} negócios`}
          hint="Mais profundidade traz mais resultados, mas demora mais e pode bloquear seu IP."
        />
        <Switch
          title="Buscar e-mails"
          description="Visita o site de cada negócio atrás de e-mails. A busca fica mais lenta."
          checked={withEmails}
          onChange={setWithEmails}
        />
      </Disclosure>
    </div>
  )
}
