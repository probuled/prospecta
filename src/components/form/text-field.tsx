import { useId, type InputHTMLAttributes, type Ref } from 'react'
import { fieldClasses } from '@/components/prospecta/input'
import { cn } from '@/lib/utils'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly label: string
  /** Mensagem de validação; troca a dica e marca o campo como inválido. */
  readonly error?: string
  readonly hint?: string
  readonly ref?: Ref<HTMLInputElement>
}

/** Campo de texto com rótulo, dica e erro já ligados por `aria-describedby`. Funciona com o `register` do React Hook Form. */
export function TextField({ label, error, hint, id, className, ref, ...props }: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`
  const message = error ?? hint

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="text-label">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        className={cn(fieldClasses, 'focus-visible:shadow-[var(--focus-ring)] aria-invalid:border-perigo', className)}
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
