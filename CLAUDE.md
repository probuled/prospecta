# CLAUDE.md — Prospecta

Este documento é curto de propósito: diz como o Claude deve trabalhar neste projeto. Os detalhes de cada assunto ficam nas seções
abaixo, e o Claude deve ler a seção correspondente **antes** de fazer a tarefa.

Ele segue o padrão de frontend React + Vite + Tailwind, adaptado ao que o Prospecta é hoje. Onde o padrão e o projeto divergem, a
seção diz o que vale aqui e por quê.

## 0. O que o projeto é (e o que não é)

O Prospecta é **só frontend**. Não existe backend próprio, banco de dados nem login.

```
Navegador (React, este repositório)
  │  leads, buscas e modelos de mensagem → localStorage do navegador
  │
  ├─ /engine ──► proxy (nginx no Docker, Vite em dev)
  │                └─► gmaps-scraper :8080 — gosom/google-maps-scraper
  │                      programa open source em Go, imagem Docker pronta.
  │                      Abre o Google Maps num navegador headless, raspa os
  │                      resultados e devolve um CSV. Não é código nosso.
  │
  └─ nominatim.openstreetmap.org — transforma a cidade em coordenadas
```

- **O que roda por trás não é uma skill nem uma IA.** É o motor de scraping
  [gosom/google-maps-scraper](https://github.com/gosom/google-maps-scraper), configurado no `docker-compose.yml` como o serviço
  `google-maps-scraper` (container `gmaps-scraper`). Ele faz o papel de "API" para o front.
- O proxy `/engine` existe porque o motor não envia cabeçalhos CORS.
- Os dados ficam **só no navegador** em que o app foi usado. Limpar os dados do site, trocar de navegador ou de computador
  começa do zero. O único backup é exportar CSV na tela de Leads.

### Quando passaria a precisar de um backend

Hoje não precisa. Um backend próprio passa a ser necessário se o projeto quiser alguma destas coisas:

| Necessidade                                                   | Por que o front sozinho não resolve                    |
| ------------------------------------------------------------- | ------------------------------------------------------ |
| Usar em mais de um computador, ou mais de uma pessoa          | `localStorage` não sincroniza                          |
| Não perder leads ao limpar o navegador                        | Precisa de banco                                       |
| Login e contas                                                | Segredo e sessão não podem ficar no front              |
| Publicar o app na internet                                    | O motor não tem autenticação; exposto, qualquer um usa |
| Buscas agendadas ou rodando com o navegador fechado           | Precisa de um processo no servidor                     |
| Enviar mensagens pela API oficial do WhatsApp (Cloud API)     | Exige token secreto                                    |
| Usar uma API paga (Google Places, enriquecimento de contatos) | A chave não pode ir para o navegador (regra 10)        |

A arquitetura já está preparada para isso (seção 4): basta escrever novos adaptadores em `src/infrastructure/` que falem com o
backend e registrá-los em `src/app/container.ts`. Nesse dia, entram o cliente HTTP único, `VITE_API_URL` e as regras de auth da
seção 6.

## 1. Stack

| Item          | Tecnologia                                                                                                        |
| ------------- | ----------------------------------------------------------------------------------------------------------------- |
| Runtime (dev) | Node.js 24 (`.nvmrc`, mesma versão do `Dockerfile`)                                                               |
| UI            | React 19 + TypeScript (strict)                                                                                    |
| Build         | Vite (`@vitejs/plugin-react`)                                                                                     |
| Estilo        | Tailwind CSS 4 (`@tailwindcss/vite`, tokens do design system em `@theme`)                                         |
| Componentes   | Design system Prospecta em `src/components/prospecta`, shadcn/ui (Base UI) em `src/components/ui`, `lucide-react` |
| Utilitários   | `class-variance-authority`, `cn()` em `src/lib/utils.ts`                                                          |
| Rotas         | React Router (`createBrowserRouter`)                                                                              |
| HTTP          | `fetch` dentro dos adaptadores de `src/infrastructure/` (não há API própria; ver seção 0)                         |
| Formulários   | React Hook Form + Zod em formulários novos (seção 7)                                                              |
| Testes        | Vitest (domínio e parsers)                                                                                        |
| Lint/format   | oxlint + Prettier (plugin Tailwind)                                                                               |
| Container     | Docker Compose: build Vite → Nginx (proxy `/engine`) + motor `gosom/google-maps-scraper`                          |
| CI            | GitHub Actions                                                                                                    |
| Travas        | husky + lint-staged + commitlint + validate-branch-name                                                           |

## 2. Regras inegociáveis

1. Nunca commitar direto em `main` ou `develop`. Todo trabalho passa por branch e PR (Git Flow).
2. Commits seguem **Conventional Commits**, validados pelo commitlint. **Nunca usar `--no-verify`.**
3. **`any` é proibido.** TypeScript em modo strict.
4. Acesso a rede só por adaptadores em `src/infrastructure/`, atrás de uma porta (interface) em `src/application/ports/`.
   Nunca chamar `fetch` direto no componente ou no hook.
5. Estilo só com Tailwind e os tokens do tema (`src/index.css`). Nada de CSS solto, cor hex ou `text-white`/`bg-black` no
   componente. A paleta padrão do Tailwind está desligada: só existem as cores do design system.
6. Componentes vêm primeiro do **design system** (`src/components/prospecta`). O que ele não tem vem do **shadcn/ui**
   (`npx shadcn@latest add <componente>`), personalizado com Tailwind e tokens. Só criar do zero o que nenhum dos dois tem.
7. **Todo formulário novo ou reescrito usa React Hook Form + Zod.** Nada de um `useState` por campo.
8. Toda tela trata **loading, erro e vazio** (incluindo o motor offline).
9. Toda tela funciona nos temas **claro e escuro**.
10. Nada de segredo no front: toda variável `VITE_*` é pública e todo código vai para o navegador.
11. Antes de dizer que terminou, rodar: `npm run lint && npm run typecheck && npm test && npm run build`.
12. Código e identificadores em **inglês**. Textos de interface, comentários, commits, PRs e documentação em **português**.
13. Mudou o formato de algo salvo no `localStorage`? Escrever a migração do formato antigo (veja `migrateSettings` em
    `src/domain/settings.ts`), com teste. Não há servidor para corrigir os dados depois.
14. **Nunca usar emoji** em commits, títulos e descrições de PR, releases, tags, `CHANGELOG.md`, documentação e comentários
    de review. Só texto. Isso vale também para a linha de assinatura do PR: escrever `Gerado com Claude Code`, sem o ícone.

## 3. Comandos

```bash
npm ci                     # instala e ativa os hooks (husky)
cp .env.example .env

docker compose up -d --build   # front em http://localhost:3000 + motor em :8080
npm run dev                    # front com hot reload em http://localhost:5173 (o motor continua no Docker)

npm run lint · npm run typecheck · npm test · npm run build · npm run format · npm run preview
```

## 4. Estrutura de pastas

O projeto usa camadas (Clean Architecture) em vez de `features/`. As dependências apontam para dentro.

```
src/
├── main.tsx
├── domain/          # regras de negócio puras, sem React nem rede (lead, funil, pontuação, mensagens)
├── application/
│   ├── ports/       # interfaces: repositórios, gateway do motor, geocoder, exportador
│   └── use-cases/   # StartSearch, SyncSearch, DeleteSearch
├── infrastructure/  # adaptadores: motor (HTTP), Nominatim, localStorage, CSV
├── app/             # composition root (container.ts), providers, router, rotas
├── presentation/
│   ├── pages/<x>/   # 1 pasta por rota, com os componentes e hooks dela
│   ├── layout/      # AppLayout, Sidebar, navegação, tema
│   ├── components/  # componentes de tela compartilhados entre páginas
│   └── hooks/       # hooks genéricos (useStore, useNow, useObservable)
├── components/
│   ├── prospecta/   # design system (Button, Select, Panel, Status…)
│   └── ui/          # shadcn/ui personalizado
├── lib/             # utils.ts (cn)
├── assets/          # fontes e logos
└── index.css        # tokens e tema
```

- `domain` não importa de nenhuma outra camada. `application` importa só de `domain`. `infrastructure` implementa as portas.
- Só `src/app/container.ts` conhece as implementações concretas; o resto recebe as dependências por `useDependencies()`.
- Uma página não importa os arquivos internos de outra. O que for compartilhado sobe para `presentation/components` ou `hooks`.
- `components/` e `lib/` nunca importam de `presentation/`, `application/` ou `infrastructure/`.
- O alias `@/` aponta para `src/`.
- Nomes de arquivo em `kebab-case` (`lead-detail-sheet.tsx`, `use-store.ts`), como o resto do projeto. Componentes exportados
  em `PascalCase`, hooks como `useX`.

## 5. Componentes e Tailwind

- Apresentação separada de lógica: estado, efeitos e acesso a dados vão para um custom hook ou caso de uso. Componente com mais de
  ~150 linhas deve ser dividido.
- Nomes: props de evento `onX`, handlers internos `handleX`, booleanos `isX`/`hasX`.
- `key` estável (o id do item), nunca o índice.
- Não usar `useEffect` para derivar estado: calcular durante o render.
- Layout mobile-first (`sm: md: lg:`). Classes condicionais com `cn()`. Variantes de componente com `cva`.
- Tokens semânticos do design system: `bg`, `surface`, `surface-sunken`, `ink`, `ink-muted`, `line`, `ouro`, `sucesso`,
  `perigo`, `whatsapp`… Valor arbitrário que se repete vira token, definido nos dois temas.
- Fonte da verdade do visual: `design-system/prospecta-design-system/prospecta-design-system/README.md`.
- Tema pelo atributo `data-theme="light|dark"` no `<html>` (o modo "Sistema" é resolvido pelo `ThemeProvider`). Ajuste
  específico do escuro usa a variante `dark:`, que já está ligada a esse atributo.
- Acessibilidade: HTML semântico, `label` em todo input, `aria-label` em botão só com ícone, foco visível, contraste AA.

## 6. Rotas, dados e estado

- Rotas com `createBrowserRouter` em `src/app/router.tsx`, caminhos em `src/app/routes.ts`. Página nova entra `lazy`, com
  `errorElement`. Endereço desconhecido cai na rota `*` (página 404).
- Filtros, paginação e busca ficam na URL (`useSearchParams`).
- Estado persistido mora nos repositórios (`Observable` + `useSyncExternalStore`). Componente lê com os hooks de
  `presentation/hooks/use-store.ts` e escreve pelos repositórios ou casos de uso, nunca no `localStorage` direto.
- Adaptadores HTTP são tipados, sem lógica de UI, e normalizam erros antes de devolver. Requisições longas aceitam
  `AbortSignal`.
- Variáveis de ambiente hoje são só de infraestrutura (portas e endereço do motor). Variável nova entra no `.env.example`, no
  `vite-env.d.ts` (se for `VITE_*`) e no README. Ao surgir a primeira `VITE_*`, validar com Zod num `src/lib/env.ts`.
- **Quando existir backend** (seção 0): cliente HTTP único em `src/infrastructure/http/`, com `baseURL` de `VITE_API_URL`,
  Bearer token, um único refresh no 401 e erros normalizados em `ApiError { status, message, fieldErrors }`.

## 7. Formulários (React Hook Form + Zod)

Os formulários atuais (busca, mensagens, detalhe do lead) ainda usam `useState` e migram quando forem reescritos. Ao criar o
primeiro, instalar `react-hook-form`, `zod` e `@hookform/resolvers`.

- O schema fica junto da página (`presentation/pages/<x>/schemas/`) ou em `domain/` se for regra de negócio, com mensagens em
  português e tipos `z.input` / `z.output`.
- `useForm({ resolver: zodResolver(schema), defaultValues: {...completos}, mode: 'onTouched' })`.
- Os campos reutilizáveis ficam em `components/form`, já com label, erro, `aria-invalid` e `aria-describedby`.
- Máscaras, selects customizados e sliders usam `Controller`. O formulário guarda só dígitos e valores em centavos.
- Listas de itens usam `useFieldArray` com `key={field.id}`.
- O componente de formulário recebe `onSubmit` e não chama repositório nem adaptador.
- Erros de validação externos vão para `setError`: no campo certo ou em `root.server`.
- Botão de submit mostra loading. Botões que não enviam têm `type="button"`.

## 8. Git Flow

| Branch                                                             | Sai de    | Merge em               | Uso                     |
| ------------------------------------------------------------------ | --------- | ---------------------- | ----------------------- |
| `main`                                                             | —         | —                      | Produção (tag `vX.Y.Z`) |
| `develop`                                                          | `main`    | `main` via release     | Integração              |
| `feature/*`                                                        | `develop` | `develop`              | Funcionalidade nova     |
| `fix/*`                                                            | `develop` | `develop`              | Bug antes da produção   |
| `release/*`                                                        | `develop` | `main` **e** `develop` | Estabilizar versão      |
| `hotfix/*`                                                         | `main`    | `main` **e** `develop` | Bug em produção         |
| `refactor/*` `chore/*` `docs/*` `ci/*` `build/*` `ui/*` `config/*` | `develop` | `develop`              | Demais mudanças         |

Formato do nome da branch: `<tipo>/<ID>-<descricao-kebab>`.

- Exemplos: `feature/APP-14-tela-pedidos`, `fix/APP-57-refresh-loop`, `release/1.2.0`.
- Tudo em minúsculas (exceto o prefixo `APP`), sem acento.
- Sem gerenciador de tarefas, o número é sequencial: pegar o maior `APP-n` em `git branch -a` / `git log --all` e somar 1.

## 9. Conventional Commits

```
<tipo>(<escopo>)<!>: <descrição>

<corpo: o quê e por quê>

<rodapé: BREAKING CHANGE: ..., Closes #12>
```

| Tipo                              | Uso                                     | Versão  |
| --------------------------------- | --------------------------------------- | ------- |
| `feat`                            | Nova funcionalidade                     | MINOR   |
| `fix`                             | Correção de bug                         | PATCH   |
| `perf`                            | Performance                             | PATCH   |
| `ui`                              | Mudança visual (Tailwind, layout, tema) | PATCH   |
| `config`                          | Configuração (vite, env)                | PATCH   |
| `refactor`                        | Reestruturação sem mudar comportamento  | —       |
| `style`                           | Formatação de código (**não é CSS**)    | —       |
| `docs` · `build` · `ci` · `chore` | Docs, deps/Docker, Actions, manutenção  | —       |
| `revert`                          | Reverter commit                         | depende |

- Descrição em **minúscula**, no **imperativo** e **sem ponto final**. Cabeçalho com até **72 caracteres**.
- Escopo em kebab-case, com o nome da área: `busca`, `leads`, `funil`, `mensagens`, `historico`, `layout`, `motor`, `tema`,
  `docker`, `deps`.
- Um commit trata de um assunto só.
- Quebra de compatibilidade: `!` no cabeçalho + rodapé `BREAKING CHANGE:`.

```
feat(mensagens): permite salvar até 10 modelos de mensagem
ui(leads): usa a logo do whatsapp no botão de contato
fix(motor): corrige status quando o job some do motor
```

Mensagens como `ajustes`, `WIP`, `fix: bug` ou `Feat: Adicionado Login.` são bloqueadas pelo commitlint ou rejeitadas no review.

## 10. Travas automáticas

| Momento  | Hook / Workflow                                              | Checa                                                         |
| -------- | ------------------------------------------------------------ | ------------------------------------------------------------- |
| commit   | `pre-commit` → `npx lint-staged`                             | oxlint `--fix` + Prettier nos arquivos alterados              |
| commit   | `commit-msg` → `npx --no -- commitlint --edit "$1"`          | Formato da mensagem                                           |
| push     | `pre-push` → `npx validate-branch-name && npm run typecheck` | Nome da branch e tipos                                        |
| PR       | `ci.yml`                                                     | lint · format · typecheck · test · build · `docker build`     |
| PR       | `pr-title.yml`                                               | Título do PR em Conventional Commits                          |
| PR       | `commitlint.yml`                                             | Todos os commits do PR                                        |
| tag `v*` | `release.yml`                                                | Imagem em `ghcr.io/probuled/prospecta:X.Y.Z` + GitHub Release |

A configuração está em `commitlint.config.mjs`, `.husky/`, `.github/workflows/` e nas chaves `lint-staged` e
`validate-branch-name` do `package.json`.

Se uma trava bloquear, corrija a causa:

- `subject must be lower-case` → `git commit --amend -m "..."`
- Nome de branch inválido → `git branch -m feature/APP-12-nome-certo`
- Erro de tipo ou lint → corrigir o código.

## 11. Dia a dia

```bash
git checkout develop && git pull --rebase
git checkout -b feature/APP-14-tela-pedidos
git add -p
git commit -m "feat(leads): adiciona filtro por bairro"
git fetch origin && git rebase origin/develop
git push -u origin feature/APP-14-tela-pedidos      # pre-push roda typecheck
```

Depois de rebase numa branch já publicada, usar `git push --force-with-lease`. Nunca usar `--force` e nunca forçar push em `main`
ou `develop`.

## 12. Pull Requests

- O título segue Conventional Commits, porque vira a mensagem do commit no squash.
- Título, descrição e notas de release só com texto, sem emoji (regra 14).
- Template preenchido (`.github/pull_request_template.md`), CI verde, PR de até ~400 linhas alteradas.
- `feature/*` e `fix/*` entram em `develop` por **Squash and merge**. `release/*` e `hotfix/*` entram em `main` por
  **Merge commit**. Depois disso, a `main` volta para a `develop` por um PR `main → develop`, também por **Merge commit**
  (seção 14).
- No squash, o GitHub soma ` (#N)` ao título: mantenha o título do PR com até **66 caracteres** para o commit final não
  passar dos 72 do commitlint.
- Apagar a branch depois do merge.

**Proteção de branch** (configurar uma vez no GitHub), para `main` e `develop`:

- Em **Settings → Rules → Rulesets**:
  - PR obrigatório (0 aprovações em projeto solo).
  - Checks obrigatórios: `ci`, `pr-title` e `commitlint`.
  - Branch atualizada antes do merge.
  - Formas de merge: só merge commit na `main`; squash e merge commit na `develop` (o merge commit é para a volta da
    `main`). Sem histórico linear obrigatório, porque ele bloquearia essa volta.
  - Force push e exclusão bloqueados, sem lista de bypass.
- Em **Settings → General → Pull Requests**:
  - Permitir squash merge, com a mensagem padrão sendo o título do PR.
  - Permitir merge commit.
  - Desativar rebase merge.
  - Apagar a branch automaticamente depois do merge.

## 13. Fluxo de entrega do Claude

1. Ler a seção do assunto e o requisito da tarefa.
2. Criar a branch `<tipo>/APP-<n>-<descricao>` a partir de `develop` atualizada.
3. Implementar em commits pequenos, seguindo Conventional Commits.
4. Rodar `lint`, `typecheck`, `test` e `build`, e revisar o próprio código com o checklist da seção 15.
5. Atualizar o `CHANGELOG.md` (seção "Não lançado") quando a mudança for visível para quem usa.
6. **Commitar localmente e mostrar o resultado**: subir com `docker compose up -d --build`, passar o link local e prints nos
   temas claro e escuro (ou dizer que não foi conferido no navegador).
7. Fazer push e abrir o PR **só depois de "pode subir"**.
8. Fazer o merge **só depois de "pode mergear"** (squash em `develop`, título do PR com até 66 caracteres).

## 14. Versão (SemVer `vMAJOR.MINOR.PATCH`)

- **MAJOR** sobe quando quebra compatibilidade, por exemplo dados salvos que deixam de ser lidos sem migração. **MINOR** sobe
  com funcionalidade nova. **PATCH** sobe com correção ou ajuste visual.
- Na fase `0.x.x`, quebra de compatibilidade sobe o MINOR. O `1.0.0` marca o projeto pronto para produção.
- A versão é a mesma no `package.json`, na tag `vX.Y.Z` e na imagem Docker. No app, ela é exposta por `__APP_VERSION__`, definido
  no `vite.config.ts`.
- `CHANGELOG.md` no formato Keep a Changelog, com as seções Adicionado, Alterado, Depreciado, Removido, Corrigido e Segurança.

```bash
git checkout -b release/1.2.0 develop
npm version 1.2.0 --no-git-tag-version
git commit -am "chore(release): 1.2.0"
# PR → main (merge commit); depois:
git checkout main && git pull && git tag -a v1.2.0 -m "release: v1.2.0" && git push origin v1.2.0
# volta da main para a develop (push direto na develop é bloqueado):
gh pr create --base develop --head main --title "chore(release): incorpora a 1.2.0 na develop"
# CI verde → merge com **Merge commit** (não squash, para a develop continuar descendo da main)
```

Hotfix é sempre PATCH: `hotfix/APP-60-...` a partir de `main`, com PR para `main`, tag e depois o mesmo PR `main → develop`.

## 15. Checklist de code review

- Corretude e casos de borda (motor offline, lead sem telefone, listas vazias, dados antigos no `localStorage`).
- Segurança: XSS, `dangerouslySetInnerHTML`, segredos.
- Contrato com o motor (`/api/v1/jobs`, formato do CSV) e com o Nominatim.
- Arquitetura: arquivo na camada certa, dependências apontando para dentro, sem import cruzado entre páginas.
- Performance: re-render, bundle, imagens.
- Clean Code.
- Documentação.

Formato do feedback, só com texto (sem emoji): **[bloqueante]** · **[sugestão]** · **[nit]** · **[pergunta]** · **[elogio]**. A
resposta termina com o veredito e o impacto na versão.
