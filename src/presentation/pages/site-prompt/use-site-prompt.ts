import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import type { Lead } from '@/domain/lead'
import { createNeighborComparer } from '@/domain/neighbor-comparison'
import { buildSitePrompt, defaultSitePromptOptions, sitePromptCoverage } from '@/domain/site-prompt'
import { useLeads } from '@/presentation/hooks/use-store'
import { sitePromptOptionsSchema, type SitePromptOptionsInput, type SitePromptOptionsOutput } from './schemas/site-prompt-options-schema'

/** Formulário dos ajustes e o prompt montado com os valores atuais, para atualizar enquanto digita. */
export function useSitePrompt(lead: Lead) {
  const leads = useLeads()
  const defaults = defaultSitePromptOptions(lead)
  const form = useForm<SitePromptOptionsInput, unknown, SitePromptOptionsOutput>({
    resolver: zodResolver(sitePromptOptionsSchema),
    defaultValues: defaults,
    mode: 'onTouched',
  })
  const values = useWatch({ control: form.control, defaultValue: defaults })
  const comparison = useMemo(() => createNeighborComparer(leads)(lead), [leads, lead])
  const prompt = buildSitePrompt(lead, { ...defaults, ...values }, comparison)
  return { form, prompt, coverage: sitePromptCoverage(lead) }
}
