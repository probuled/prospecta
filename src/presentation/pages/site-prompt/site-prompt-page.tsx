import { ArrowLeft, Check, Copy, Download, SearchX } from 'lucide-react'
import { useParams } from 'react-router'
import { toast } from 'sonner'
import { useDependencies } from '@/app/dependencies-context'
import { leadDetail, ROUTES } from '@/app/routes'
import { Button, ButtonLink } from '@/components/prospecta/button'
import { EmptyState } from '@/components/prospecta/empty-state'
import { PageHeader } from '@/components/prospecta/page-header'
import { Panel } from '@/components/prospecta/panel'
import type { Lead } from '@/domain/lead'
import { formatCount } from '@/presentation/format'
import { useCopyToClipboard } from '@/presentation/hooks/use-copy-to-clipboard'
import { useLeads } from '@/presentation/hooks/use-store'
import { PromptCoverage } from './prompt-coverage'
import { SitePreviewCallout } from './site-preview-callout'
import { SitePromptOptionsForm } from './site-prompt-options-form'
import { useSitePrompt } from './use-site-prompt'

/** "Barbearia do Zé" → "barbearia-do-ze", para o nome do arquivo baixado. */
function slugOf(name: string): string {
  const slug = name
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return slug || 'site'
}

export function SitePromptPage() {
  const { leadId = '' } = useParams()
  const lead = useLeads().find((candidate) => candidate.id === leadId)

  if (!lead) {
    return (
      <>
        <PageHeader title="Prompt do site" />
        <EmptyState
          icon={SearchX}
          title="Lead não encontrado."
          description="Ele pode ter sido excluído junto com a busca. Escolha outro lead para gerar o prompt."
          action={<ButtonLink to={ROUTES.leads}>Ver leads</ButtonLink>}
        />
      </>
    )
  }

  return <SitePromptEditor key={lead.id} lead={lead} />
}

function SitePromptEditor({ lead }: { readonly lead: Lead }) {
  const { files } = useDependencies()
  const { form, prompt, coverage } = useSitePrompt(lead)
  const { copy, isCopied } = useCopyToClipboard()

  const handleCopy = async () => {
    if (await copy(prompt)) toast.success('Prompt copiado', { description: 'Cole numa IA para ela criar o site.' })
    else toast.error('Não foi possível copiar. Baixe o arquivo .md e copie de lá.')
  }

  return (
    <>
      <div className="space-y-3">
        <ButtonLink to={leadDetail(lead.id)} variant="ghost" className="-ml-3" aria-label={`Voltar para ${lead.name}`}>
          <ArrowLeft /> Voltar
        </ButtonLink>
        <PageHeader
          title="Prompt do site"
          description={`Tudo o que o Prospecta sabe sobre ${lead.name}, com diretrizes de design, pronto para colar numa IA e gerar o site.`}
        />
      </div>
      <SitePreviewCallout lead={lead} />
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <div className="space-y-4">
          <Panel title="Ajustes">
            <SitePromptOptionsForm form={form} />
          </Panel>
          <Panel title="O que entra no prompt">
            <PromptCoverage coverage={coverage} />
          </Panel>
        </div>
        <Panel
          title="Prompt"
          action={
            <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
              <span className="text-data text-ink-muted">{formatCount(prompt.length)} caracteres</span>
              <div className="flex gap-2">
                <Button icon={Download} onClick={() => files.downloadText(prompt, `prompt-site-${slugOf(lead.name)}.md`, 'text/markdown')}>
                  Baixar .md
                </Button>
                <Button variant="primary" icon={isCopied ? Check : Copy} onClick={handleCopy}>
                  {isCopied ? 'Copiado' : 'Copiar prompt'}
                </Button>
              </div>
            </div>
          }
          bodyClassName="p-0"
        >
          <pre className="max-h-[75svh] overflow-auto bg-surface-sunken p-5 font-mono text-[13px] leading-relaxed wrap-anywhere whitespace-pre-wrap text-ink">
            {prompt}
          </pre>
        </Panel>
      </div>
    </>
  )
}
