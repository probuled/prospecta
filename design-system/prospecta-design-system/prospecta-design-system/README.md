Prospecta encontra negócios locais no Google Maps e mostra primeiro quem não tem site e é bem avaliado. É uma ferramenta de trabalho para quem vende sites: densa, calma, precisa. O layout atual (sidebar + conteúdo, busca no topo, tabela e pipeline) fica; o que muda é o acabamento. Este documento é a regra para quem for implementar — inclusive outro agente.

## Princípios

1. **Neutro primeiro, ouro como sinal.** A interface é papel e tinta. Ouro (`ouro`) aparece em poucos lugares: o botão primário, o ícone do item ativo, a estrela da nota. Se uma tela tem mais de três manchas de ouro, algo está errado.
2. **Bordas, não sombras.** Hierarquia vem de `line`, `surface` e espaço. Sombra (`shadow-overlay`) só no que flutua: menus e card sendo arrastado.
3. **Cantos firmes.** `radius-md` (6px) em controles, `radius-lg` (10px) em painéis. Nada de cantos de 16–24px.
4. **O dado é o herói.** Números em mono (`data`), alinhados, formatados em pt-BR. Cor só onde ela muda uma decisão (temperatura, status).
5. **Uma ação primária por tela.**

## O que evitar (o "cara de vibe-code")

Isto é o que a versão atual tem e não deve voltar:

- Ícone genérico de alvo num quadrado amarelo no lugar da marca → use o componente `Logo` com a logo oficial.
- Pílulas coloridas com bolinha para tudo (temperatura, presença, status, contagem) → só `Score` tem cor; `Presence` é neutro; `Status` é um quadradinho de 8px + palavra.
- Botão primário em amarelo pastel que parece desabilitado → `ouro` cheio com texto `on-ouro`.
- Ícone dentro de círculo tingido (o WhatsApp verde-claro) → ícone na cor `whatsapp` dentro de um `Button` neutro.
- Preto puro no tema escuro → grafite quente (`bg` #1F1E1B, `surface` #282723).
- Verde para "Sem site" e roxo para "Só rede social" → peso tipográfico, não arco-íris.
- Nuvem de sugestões em pílulas de 3 linhas → `TagList`, retangular, no máximo 2 linhas.
- Legenda que dá conselho ("aborde primeiro", "público da landing page") → nota que informa ("score ≥ 80", "52% da busca").
- Emoji em UI e no texto da mensagem padrão (👉), cantos 20px, Inter, `rounded-2xl shadow-lg` em tudo, cards com borda esquerda colorida, gradientes na interface (o da logo é exceção).

## Voz e texto

- Português do Brasil, tratando por **você**. Frases curtas. Sem ponto de exclamação, sem emoji.
- Sentence case em tudo: "Opções avançadas", "Buscar leads" (nunca "Buscar Leads").
- Botões com verbo no infinitivo: "Buscar leads", "Exportar", "Salvar mensagem", "Restaurar padrão".
- O verbo do produto é **buscar** / **prospectar**. Termos fixos: *lead*, *nicho*, *oportunidade*, *quente / morno / frio*, *sem site*, *só rede social*.
- Números pt-BR: nota `4,9`, milhar `1.203`, dinheiro `R$ 4.800`, telefone `(81) 99302-6226`, duração `2m 47s`. Use `Intl.NumberFormat('pt-BR')`.
- Estados vazios dizem o próximo passo: "Arraste um lead para cá", "Nenhum lead ainda. Faça uma busca."

## Cor

Dois temas: **Claro** (papel quente) e **Escuro** (grafite quente). Use sempre o token, nunca o hex.

- Superfícies: `bg` (página e sidebar) → `surface` (painéis, tabela, inputs) → `surface-sunken` (trilhos, cabeçalho de tabela, colunas do pipeline) → `surface-hover`.
- Texto: `ink` para conteúdo, `ink-muted` para metadado e placeholder. `ink-faint` só para ícone inativo e desabilitado.
- Bordas: `line` para painéis e divisórias; `line-strong` para borda de controle de formulário (3:1).
- Marca: `ouro` preenche, `on-ouro` escreve por cima, `ouro-text` quando ouro precisa ser texto, `ouro-soft` como tinta de fundo rara.
- Temperatura: `quente` ≥ 80, `morno` 50–79, `frio` < 50, cada um com `-soft` para o badge de card. Sempre com a palavra junto.
- Status do funil: Novo (vazado, `ink-muted`), Contatado `info`, Respondeu `ouro`, Negociando `ameixa`, Fechado `sucesso`, Perdido `ink-faint`.
- `whatsapp` é só o ícone do WhatsApp. `perigo` (alias de `quente`) para erro e destrutivo.
- Todo par de texto declarado nas notas dos tokens passa 4,5:1 nos dois temas; bordas de controle e o foco passam 3:1.

## Tipografia

- **Schibsted Grotesk** (variável, 400–900) para a interface; **IBM Plex Mono** (400/500) para dado de máquina: telefone, score, contagens, tempo.
- Escala: `display` 28/34 (título da página, um por tela) · `metric` 26/32 · `title` 16/22 · `body` 14/20 · `body-strong` 14/20 500 · `label` 13/16 · `caption` 12/16 · `overline` 11/14 caixa alta · `data` 13/20 mono.
- Pesos só 400, 500, 600. Títulos com tracking negativo leve (já no token). Nunca negrito 700 em texto de interface.
- Os arquivos estão em `fonts/`. No app, sirva com `@font-face` (ou `@fontsource-variable/schibsted-grotesk` + `@fontsource/ibm-plex-mono`).

## Espaço e layout

- Base 4px: `space-1` 4 · `space-2` 8 · `space-3` 12 · `space-4` 16 · `space-5` 20 · `space-6` 24 · `space-8` 32 · `space-12` 48.
- Sidebar fixa `sidebar-width` (232px). Conteúdo até `content-max` (1240px), gutter `space-12`, topo `space-12`.
- Cabeçalho da página: `display` + subtítulo `body` em `ink-muted`; ações à direita (SegmentedControl Lista/Pipeline, Button Exportar). `space-8` até o próximo bloco.
- Alturas: controles `control-md` 36px, em tabela/card `control-sm` 28px, busca principal `control-lg` 56px, linha da tabela `row-height` 60px.

## Forma, estados e movimento

- Raios: `radius-sm` 4 (tags, marcadores), `radius-md` 6 (botões, inputs), `radius-lg` 10 (painéis, cards, tabela), `radius-full` só no switch.
- Hover: troca de fundo para `surface-hover` ou borda para `line-strong`. Nada de escala ou brilho.
- Foco de teclado: `focus-ring` em tudo que é interativo (2px na cor da página + 2px sólidos de `focus`).
- Movimento: 120ms `ease-out` para cor, borda e o giro da seta. Sem animação de entrada, sem bounce.

## Iconografia

- Lucide (`lucide-react`) com `strokeWidth={1.5}`, 16px (17px na sidebar, 18px na barra de busca). O componente `Icon` traz os usados nas telas.
- Ícone herda a cor do texto. Sem fundo, sem círculo, sem emoji.
- Mapeamento: Buscar `Search`, Leads `Users`, Histórico `History`, Mensagem `MessageSquare`, WhatsApp `MessageCircle`, Sem site `GlobeOff`, Só rede social `AtSign`, Tem site `Link`.

## Logo

- A logo oficial é o P preto com haste dourada e ponto ouro, seguido de "rospecta". Use sempre os arquivos de `assets/Logos` ou o componente `Logo` — nunca redesenhe nem escreva o nome em texto no lugar dela.
- **Logo completa** (`Logo`): sidebar expandida, login, e-mails, exportações. **Só o P** (`Logo variant="symbol"`): sidebar recolhida, favicon, app icon, avatar, loading.
- Tema escuro usa a versão com tinta `#EDEBE5`; o componente troca sozinho.
- O degradê dourado é da logo e fica só nela: a interface continua com `ouro` chapado.
- Não recolorir, girar, esticar, separar as partes, aplicar sombra ou contorno.

## Para implementar (React + TypeScript)

- Gere as variáveis CSS de `tokens.json` (o `tokens.css` deste sistema) e aplique o tema com `data-theme="light|dark"` no `<html>`; "Sistema" segue `prefers-color-scheme`.
- Tailwind: mapeie para as variáveis, não para hex — `colors: { bg: 'var(--bg)', surface: 'var(--surface)', ink: 'var(--ink)', 'ink-muted': 'var(--ink-muted)', line: 'var(--line)', ouro: 'var(--ouro)', … }`, `borderRadius: { sm: 'var(--radius-sm)', md: 'var(--radius-md)', lg: 'var(--radius-lg)' }`, `fontFamily: { sans: 'var(--font-sans)', mono: 'var(--font-mono)' }`. Desligue a paleta padrão do Tailwind para ninguém voltar a usar `yellow-300`.
- Os componentes em `components/` são a referência de marcação, classes e estados: recrie-os como componentes TS do app com a mesma API (`index.d.ts`). Menus, popovers e diálogos: Radix UI por baixo, estilizados com estes tokens. Arrastar no pipeline: dnd-kit.
