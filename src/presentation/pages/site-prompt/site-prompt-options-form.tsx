import { Controller, type UseFormReturn } from 'react-hook-form'
import { TextAreaField } from '@/components/form/text-area-field'
import { Select, type SelectOption } from '@/components/prospecta/select'
import { SITE_TARGET_LABELS, SITE_TARGETS, type SiteTarget } from '@/domain/site-prompt'
import { SITE_STYLE_LABELS, SITE_STYLES, type SiteStyle } from '@/domain/site-prompt-styles'
import type { SitePromptOptionsInput } from './schemas/site-prompt-options-schema'

const TARGET_OPTIONS: SelectOption<SiteTarget>[] = SITE_TARGETS.map((target) => ({ value: target, label: SITE_TARGET_LABELS[target] }))
const STYLE_OPTIONS: SelectOption<SiteStyle>[] = SITE_STYLES.map((style) => ({ value: style, label: SITE_STYLE_LABELS[style] }))

/** Ajustes do prompt. Não tem envio: o prompt ao lado muda enquanto você edita. */
export function SitePromptOptionsForm({ form }: { readonly form: UseFormReturn<SitePromptOptionsInput> }) {
  const {
    control,
    register,
    formState: { errors },
  } = form

  return (
    <form noValidate onSubmit={(event) => event.preventDefault()} className="space-y-4">
      <div className="space-y-1.5">
        <span className="text-label">Onde vai colar</span>
        <Controller
          control={control}
          name="target"
          render={({ field }) => (
            <Select
              value={field.value}
              options={TARGET_OPTIONS}
              onChange={field.onChange}
              aria-label="Onde vai colar"
              className="w-full justify-between"
            />
          )}
        />
      </div>
      <div className="space-y-1.5">
        <span className="text-label">Direção de design</span>
        <Controller
          control={control}
          name="style"
          render={({ field }) => (
            <Select
              value={field.value}
              options={STYLE_OPTIONS}
              onChange={field.onChange}
              aria-label="Direção de design"
              className="w-full justify-between"
            />
          )}
        />
      </div>
      <TextAreaField
        label="Observações"
        hint="O que você sabe e o Google não: o dono quer agendamento, prefere azul, tem 2 unidades…"
        placeholder="Ex.: destacar o espaço kids e o estacionamento"
        error={errors.notes?.message}
        {...register('notes')}
      />
    </form>
  )
}
