export function EngineOfflineAlert() {
  return (
    <div role="status" className="flex items-start gap-3 rounded-lg border border-line bg-surface px-5 py-4">
      <i className="mt-1.5 block size-1.5 shrink-0 rounded-[1px] bg-quente" />
      <div className="space-y-0.5">
        <p className="font-medium">O motor de busca está parado</p>
        <p className="text-ink-muted">
          Abra o Docker Desktop e rode <code className="rounded-sm bg-surface-sunken px-1.5 py-0.5 text-data text-ink">docker compose up -d</code> na pasta do projeto.
        </p>
      </div>
    </div>
  )
}
