import { z } from 'zod'
import { SITE_TARGETS } from '@/domain/site-prompt'
import { SITE_STYLES } from '@/domain/site-prompt-styles'

export const sitePromptOptionsSchema = z.object({
  target: z.enum(SITE_TARGETS, { error: 'Escolha onde vai usar o prompt.' }),
  style: z.enum(SITE_STYLES, { error: 'Escolha a direção de design.' }),
  notes: z.string().trim().max(1000, 'Use até 1.000 caracteres nas observações.'),
})

export type SitePromptOptionsInput = z.input<typeof sitePromptOptionsSchema>
export type SitePromptOptionsOutput = z.output<typeof sitePromptOptionsSchema>
