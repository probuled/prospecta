# Prospecta — design system para o Claude Code

Coloque esta pasta na raiz do projeto (ex.: `design-system/`) e mande ao Claude Code:

> Leia `design-system/README.md` e aplique este design system ao frontend. Use `tokens.css` como fonte das cores, fontes, espaçamentos e raios (tema via `data-theme="light|dark"` no `<html>`). Recrie os componentes de `components/` como componentes React + TypeScript seguindo `components/index.d.ts`, os `README.md` de cada componente e os estilos de `components/bundle.css`. Troque a logo atual pelos arquivos de `assets/Logos`. Mantenha o layout das telas; mude só o visual. Siga a seção "O que evitar" do README à risca.

Conteúdo:
- `README.md` — regras da marca (comece por aqui)
- `tokens.json` / `tokens.css` — tokens (claro e escuro)
- `fonts/` — Schibsted Grotesk e IBM Plex Mono (woff2)
- `components/` — referência de cada componente: `README.md`, `preview.html`, `bundle.js`, `bundle.css`, `index.d.ts`
- `assets/Logos/` — logo completa, símbolo P e app icons (claro e escuro)

Observação: os `preview.html` e o `bundle.js` apontam a logo para `/_blob/...` (endereços do artifact). No app, use os PNGs de `assets/Logos`.
