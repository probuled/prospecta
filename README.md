# Prospecta

Encontra negócios locais no Google Maps e ordena quem tem mais chance de comprar uma landing page:
quem **não tem site** (ou só tem Instagram/Linktree), é bem avaliado e tem celular para WhatsApp vem primeiro.

Usa o motor open source [gosom/google-maps-scraper](https://github.com/gosom/google-maps-scraper) rodando
localmente no Docker, do jeito que o [google-maps-scraper-kit](https://github.com/Mahanaicoach/google-maps-scraper-kit)
configura. Não precisa de chave de API nem de conta paga.

## O que dá para fazer

| Tela          | Endereço  | Para quê                                                                          |
| ------------- | --------- | --------------------------------------------------------------------------------- |
| **Buscar**    | `/`       | Escolher nicho e cidade, disparar a busca e acompanhar o andamento                |
| **Leads**     | `/leads`  | Ver os leads em tabela ou no funil (arrastar entre etapas), filtrar, exportar CSV |
| **Histórico** | `/buscas` | Ver as buscas feitas, abrir os leads de cada uma ou apagar a busca                |
| **Mensagens** | `/config` | Escrever até 10 modelos de mensagem de abordagem usados no botão de WhatsApp      |

O app funciona nos temas claro e escuro (ou segue o sistema) e no celular.

## O que roda por trás

**Este repositório é só o frontend.** Não há backend próprio, banco nem login.

```
Navegador (React)
  │  leads, buscas e modelos de mensagem → localStorage do navegador
  │
  ├─ /engine ──► proxy (nginx no Docker, Vite em dev)
  │                └─► gmaps-scraper :8080 — gosom/google-maps-scraper
  │
  └─ nominatim.openstreetmap.org — transforma a cidade em coordenadas
```

- A raspagem é feita pelo [gosom/google-maps-scraper](https://github.com/gosom/google-maps-scraper), um programa open source em
  Go que roda no container `gmaps-scraper`. Não é uma skill nem uma IA, e não é código deste projeto: é uma imagem Docker pronta
  que o `docker-compose.yml` sobe ao lado do front. Ele abre o Google Maps num navegador headless e devolve os resultados em CSV.
- O proxy `/engine` existe porque o motor não envia cabeçalhos CORS.
- Leads, buscas e modelos de mensagem ficam no `localStorage` do navegador. Outro navegador ou computador começa vazio, e limpar
  os dados do site apaga tudo. Para guardar, exporte CSV na tela de Leads.

Um backend próprio só passa a ser necessário para sincronizar dados entre computadores ou pessoas, ter login, publicar o app na
internet, agendar buscas ou usar APIs com chave secreta. O `CLAUDE.md` (seção 0) detalha cada caso e como a arquitetura já
prevê essa troca.

## Rodando

### Requisitos

- **Docker** com Docker Compose (Docker Desktop no Windows/macOS; no WSL, ative Settings → Resources → WSL Integration).
- **Node.js 24** (só para desenvolver com hot reload; a versão está no `.nvmrc`).

### Com Docker (jeito mais simples)

```bash
git clone https://github.com/probuled/prospecta.git
cd prospecta
cp .env.example .env            # opcional: só se quiser trocar as portas
docker compose up -d --build    # sobe front + motor
```

Abra **http://localhost:3000**. Na primeira vez ele baixa as imagens e faz o build (alguns minutos).

| Serviço               | Endereço              |
| --------------------- | --------------------- |
| Frontend (nginx)      | http://localhost:3000 |
| Motor de scraping API | http://localhost:8080 |

Depois de mudar o código, rode `docker compose up -d --build` de novo.

```bash
docker compose logs -f google-maps-scraper   # acompanhar o motor
docker compose down                          # parar tudo (os resultados do motor ficam no volume)
```

### Desenvolvimento com hot reload

Deixe o motor no Docker e rode o front com Node:

```bash
nvm use                                     # Node 24, do .nvmrc
npm ci                                      # instala e ativa os hooks do git (husky)
cp .env.example .env
docker compose up -d google-maps-scraper    # só o motor
npm run dev                                 # http://localhost:5173
```

### Variáveis de ambiente

Todas são opcionais e só de infraestrutura. Não há segredo no front: toda variável `VITE_*` iria para o navegador.

| Variável       | Padrão                  | Usada em             | Para quê                                   |
| -------------- | ----------------------- | -------------------- | ------------------------------------------ |
| `WEB_PORT`     | `3000`                  | `docker-compose.yml` | Porta do frontend no host                  |
| `SCRAPER_PORT` | `8080`                  | `docker-compose.yml` | Porta do motor no host                     |
| `SCRAPER_URL`  | `http://localhost:8080` | `vite.config.ts`     | Endereço do motor no proxy `/engine` (dev) |

As portas ficam presas ao `127.0.0.1` porque nenhum dos serviços tem autenticação. Não exponha para a rede sem colocar um
proxy com autenticação na frente.

### Problemas comuns

- **"Motor parado" no app**: o container `gmaps-scraper` não está de pé. Rode `docker compose ps` e
  `docker compose up -d google-maps-scraper`.
- **Porta em uso**: troque `WEB_PORT` ou `SCRAPER_PORT` no `.env` (e `SCRAPER_URL`, se mudar a porta do motor em dev).
- **Busca não traz resultados ou para no meio**: o Google pode ter bloqueado o IP temporariamente. Espere um pouco e faça
  buscas menores.
- **`docker` não encontrado no WSL**: ative a integração com o WSL no Docker Desktop.

## Como funciona

1. Você escolhe nicho e cidade. A cidade vira coordenadas via OpenStreetMap (Nominatim).
2. O app cria um job no motor (`POST /api/v1/jobs`) e acompanha o status a cada 5s, em qualquer página.
3. Quando o job termina, o CSV é baixado, limpo e salvo como leads no `localStorage` do navegador.
4. Cada lead recebe uma pontuação de oportunidade (`src/domain/opportunity.ts`).
5. O botão de WhatsApp abre a conversa com a sua mensagem de abordagem já preenchida (página **Mensagens**).

## Stack

React 19 + TypeScript (strict), Vite, Tailwind CSS 4, React Router, shadcn/ui (Base UI), `lucide-react`, Papa Parse,
Vitest, oxlint + Prettier. Em produção, o build é servido por Nginx num container.

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

| Comando                | O que faz                                  |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | servidor de desenvolvimento                |
| `npm test`             | testes de domínio e do parser              |
| `npm run typecheck`    | checagem de tipos                          |
| `npm run build`        | type-check e build                         |
| `npm run preview`      | serve o build localmente (com o `/engine`) |
| `npm run lint`         | oxlint                                     |
| `npm run format`       | formata o projeto com Prettier             |
| `npm run format:check` | confere a formatação (usado na CI)         |

Antes de abrir um PR: `npm run lint && npm run typecheck && npm test && npm run build`.

## Contribuindo

O fluxo de trabalho (Git Flow, Conventional Commits, PRs, versão e travas automáticas) está no [`CLAUDE.md`](CLAUDE.md).
As mudanças de cada versão ficam no [`CHANGELOG.md`](CHANGELOG.md).

## Aviso

O Prospecta é um projeto de estudo e de uso pessoal. Ele não tem vínculo com o Google, e o código vem
"como está", sem garantia (veja a [licença](LICENSE)). Quem roda o projeto é o único responsável pelo uso
que faz dele: respeitar os termos de uso do Google, a LGPD e as regras do WhatsApp cabe a quem usa, não
aos autores.

## Cuidados

- Raspar o Google Maps vai contra os termos de uso do Google. Use com moderação: uma busca por vez e
  profundidade baixa. Se exagerar, o Google bloqueia seu IP temporariamente (sua conta Google não é afetada).
- Telefones e emails são dados pessoais (LGPD). Faça abordagens individuais e respeite quem pedir para
  não ser contatado. Disparo em massa pode banir seu número no WhatsApp.

## Licença

[MIT](LICENSE) © 2026 Luan Costa. O motor [gosom/google-maps-scraper](https://github.com/gosom/google-maps-scraper) é um
projeto à parte, com licença própria (também MIT).
