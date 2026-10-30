import { useId, type Ref, type TextareaHTMLAttributes } from 'react'
import { fieldClasses } from '@/components/prospecta/input'
import { cn } from '@/lib/utils'

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  readonly label: string
  /** Mensagem de validação; troca a dica e marca o campo como inválido. */
  readonly error?: string
  readonly hint?: string
  readonly ref?: Ref<HTMLTextAreaElement>
}

/** Texto de várias linhas com rótulo, dica e erro ligados por `aria-describedby`. Funciona com o `register` do React Hook Form. */
export function TextAreaField({ label, error, hint, id, className, ref, rows = 4, ...props }: TextAreaFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const messageId = `${fieldId}-message`
  const message = error ?? hint

  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="text-label">
        {label}
      </label>
      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        className={cn(fieldClasses, 'h-auto resize-y py-2 focus-visible:shadow-[var(--focus-ring)] aria-invalid:border-perigo', className)}
        {...props}
      />
      {message && (
        <p id={messageId} className={cn('text-caption', error ? 'text-perigo' : 'text-ink-muted')}>
          {message}
        </p>
      )}
    </div>
  )
}
