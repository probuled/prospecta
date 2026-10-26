# Icon

Ícones de traço 1.5 em grade 24 (desenho no estilo Lucide), servidos inline pelo bundle.

- `name`, `size` (padrão 16), `label` opcional (sem `label` o ícone é decorativo e fica `aria-hidden`).
- No app React use `lucide-react` com `strokeWidth={1.5}` e `size={16}` — os nomes do bundle seguem os do Lucide (`whatsapp` → `MessageCircle`, `globe-off` → `GlobeOff`).
- Ícone sempre na cor do texto ao lado (`currentColor`). Nunca dentro de um círculo ou quadrado colorido.
