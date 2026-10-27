# Prospecta

Encontra negócios locais no Google Maps e ordena quem tem mais chance de comprar uma landing page:
quem **não tem site** (ou só tem Instagram/Linktree), é bem avaliado e tem celular para WhatsApp vem primeiro.

Usa o motor open source [gosom/google-maps-scraper](https://github.com/gosom/google-maps-scraper) rodando
localmente no Docker, do jeito que o [google-maps-scraper-kit](https://github.com/Mahanaicoach/google-maps-scraper-kit)
configura. Não precisa de chave de API nem de conta paga.

## O que roda por trás

**Este repositório é só o frontend.** Não há backend próprio, banco nem login:

- A raspagem é feita pelo [gosom/google-maps-scraper](https://github.com/gosom/google-maps-scraper), um programa open source em
  Go que roda no container `gmaps-scraper`. Não é uma skill nem uma IA, e não é código deste projeto: é uma imagem Docker pronta
  que o `docker-compose.yml` sobe ao lado do front.
- Leads, buscas e modelos de mensagem ficam no `localStorage` do navegador. Outro navegador ou computador começa vazio; para
  guardar, exporte CSV na tela de Leads.

Um backend próprio só passa a ser necessário para sincronizar dados entre computadores ou pessoas, ter login, publicar o app na
internet, agendar buscas ou usar APIs com chave secreta. O `CLAUDE.md` (seção 0) detalha cada caso e como a arquitetura já
prevê essa troca.

## Rodando

Requisito: Docker Desktop (no WSL, ative Settings → Resources → WSL Integration).

```bash
docker compose up -d --build   # sobe front + motor
```

Abra **http://localhost:3000**. Na primeira vez ele baixa as imagens e faz o build (alguns minutos).

| Serviço               | Endereço              |
| --------------------- | --------------------- |
| Frontend (nginx)      | http://localhost:3000 |
| Motor de scraping API | http://localhost:8080 |

Depois de mudar o código, rode `docker compose up -d --build` de novo.
Para desenvolver com hot reload, deixe o motor no Docker e rode o front com Node 24 (`.nvmrc`):

```bash
npm ci                         # também ativa os hooks do git
npm run dev                    # http://localhost:5173
```

## Como funciona

1. Você escolhe nicho e cidade. A cidade vira coordenadas via OpenStreetMap (Nominatim).
2. O app cria um job no motor (`POST /api/v1/jobs`) e acompanha o status a cada 5s, em qualquer página.
3. Quando o job termina, o CSV é baixado, limpo e salvo como leads no `localStorage` do navegador.
4. Cada lead recebe uma pontuação de oportunidade (`src/domain/opportunity.ts`).
5. O botão de WhatsApp abre a conversa com a sua mensagem de abordagem já preenchida (página **Mensagens**, com até 10 modelos salvos).

O navegador fala com o motor pelo proxy `/engine` do Vite, porque o motor não envia cabeçalhos CORS.

## Arquitetura

```
src/
  domain/                regras de negócio puras (lead, funil, pontuação, telefone, presença online)
  application/           portas (interfaces) e casos de uso: StartSearch, SyncSearch, DeleteSearch
  infrastructure/        adaptadores: API do motor, Nominatim, localStorage, exportação CSV
  app/                   composition root (container.ts), providers e rotas
  presentation/          páginas, layout e hooks React
  components/prospecta/  componentes do design system (Button, Select, Score, Status, …)
  components/ui/         primitivos do shadcn ainda usados (sheet, dialog, checkbox, toasts)
```

As dependências apontam para dentro: a apresentação usa casos de uso, que dependem só de interfaces.
Trocar o `localStorage` por um banco, ou o motor por outra API, é escrever um novo adaptador e
registrá-lo em `src/app/container.ts`.

## Design system

A fonte da verdade é `design-system/prospecta-design-system/prospecta-design-system/README.md`
(princípios, voz, cor, tipografia, componentes e o que evitar).

- Tokens em `src/index.css`, gerados de `tokens.css`. Tema via `data-theme="light|dark"` no `<html>`.
- A paleta padrão do Tailwind está desligada: só existem as cores do sistema (`bg-surface`, `text-ink-muted`,
  `border-line`, `bg-ouro`, …). Use sempre o token, nunca o hex.
- Fontes (Schibsted Grotesk e IBM Plex Mono) e logos oficiais em `src/assets/`.
- Componentes em `src/components/prospecta/`, com a API do `components/index.d.ts` do sistema.

## Scripts

| Comando             | O que faz                      |
| ------------------- | ------------------------------ |
| `npm run dev`       | servidor de desenvolvimento    |
| `npm test`          | testes de domínio e do parser  |
| `npm run typecheck` | checagem de tipos              |
| `npm run build`     | type-check e build             |
| `npm run lint`      | oxlint                         |
| `npm run format`    | formata o projeto com Prettier |

## Contribuindo

O fluxo de trabalho (Git Flow, Conventional Commits, PRs, versão e travas automáticas) está no [`CLAUDE.md`](CLAUDE.md).
As mudanças de cada versão ficam no [`CHANGELOG.md`](CHANGELOG.md).

## Cuidados

- Raspar o Google Maps vai contra os termos de uso do Google. Use com moderação: uma busca por vez e
  profundidade baixa. Se exagerar, o Google bloqueia seu IP temporariamente (sua conta Google não é afetada).
- Telefones e emails são dados pessoais (LGPD). Faça abordagens individuais e respeite quem pedir para
  não ser contatado. Disparo em massa pode banir seu número no WhatsApp.
