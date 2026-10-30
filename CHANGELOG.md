# Changelog

Todas as mudanças relevantes do projeto ficam registradas aqui.

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto usa
[Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Adicionado

- Backup completo: "Baixar backup" na tela de Leads gera um arquivo JSON com os leads (etapa, notas, valor, próximo
  contato), as buscas e os modelos de mensagem. "Restaurar backup" traz tudo de volta em outro navegador ou
  computador, juntando com o que já existe sem apagar nada.
- Prompt do site: no detalhe do lead, "Gerar prompt do site" monta um prompt com tudo o que se sabe do negócio
  (endereço, telefone, WhatsApp, fotos, horários, avaliações, reclamações, concorrência, localização para o mapa) e
  diretrizes de design por nicho (clima, paleta, tipografia, estrutura da página, SEO local, acessibilidade e o que
  evitar). É só copiar e colar numa IA (Claude, ChatGPT, Lovable, v0) para ela criar o site do lead. Dá para escolher
  entre HTML + CSS ou React + TailwindCSS, trocar a direção de design e somar observações.
- Raio-x do perfil no detalhe do lead: o que falta no perfil do Google (site, dono identificado, horário, foto, descrição,
  pedido ou agendamento online) e quantos concorrentes da mesma categoria, num raio de 2 km, já têm site.
- Variável `{diagnostico}` nas mensagens, com o argumento do raio-x pronto para a abordagem.
- Variáveis `{elogio}` e `{dor}` nas mensagens: um trecho da melhor avaliação do negócio e a reclamação mais comum que um
  site resolve (telefone que ninguém atende, espera, falta de preço ou horário, endereço difícil). O detalhe do lead mostra
  os dois em "O que os clientes dizem".
- Painel "Bairros sem site" no mapa, com os bairros onde a maioria dos negócios encontrados não tem site próprio.
- As buscas passam a guardar o perfil completo do negócio no Google (horários, avaliações escritas, fotos, bairro). Leads
  antigos ganham o perfil quando aparecem numa busca nova.

### Alterado

- Pontuação de oportunidade: perfil do Google sem horário ou sem foto soma 5 pontos.

## [0.3.0] - 2026-10-29

### Alterado

- Ao clicar num lead no mapa, o cartão dele abre em cima do próprio ponto, em vez de na coluna ao lado. No celular, o
  mapa se desloca para o cartão caber inteiro.
- Mapa maior: os filtros de busca e status saem de cima do mapa e vão para a coluna ao lado, abaixo da legenda, que
  ficou mais estreita.

## [0.2.2] - 2026-10-29

### Alterado

- Mapa de fundo com as cores do Prospecta: chão, água, parques, ruas e nomes seguem a paleta do app, nos temas claro e
  escuro.

### Corrigido

- Mapa que ficava em "Carregando mapa..." na versão em Docker: o worker do MapLibre saía como `.mjs`, que o nginx
  entrega sem tipo JavaScript, e o navegador se recusava a rodá-lo.
- O mapa mostra o erro com "Tentar de novo" quando não termina de carregar em 20 segundos, em vez de ficar carregando
  para sempre.

## [0.2.1] - 2026-10-29

### Alterado

- README abre com a seção "Veja como é": prints do mapa (globo e ruas), do pipeline, do detalhe do lead e das mensagens,
  logo depois da apresentação.

## [0.2.0] - 2026-10-29

### Adicionado

- Tela **Mapa**: mostra onde fica cada lead, num globo que vira mapa de ruas ao aproximar. Os pontos têm a cor da etapa
  do funil, ficam agrupados quando estão perto e podem ser filtrados por busca e status.
- Botão **Localizar leads** para dar posição aos leads salvos antes do mapa, primeiro pelo motor e depois pelo endereço.
- A posição de cada negócio passa a ser salva junto com o lead.
- Link direto para o detalhe de um lead na tela de Leads (`/leads?lead=<id>`).

### Alterado

- README com prints de cada etapa do uso: mensagens, detalhe do lead, pipeline e mapa (globo e ruas), nos temas claro e
  escuro.

## [0.1.2] - 2026-10-28

### Alterado

- README abre com um print da tela de Leads, nos temas claro e escuro.

## [0.1.1] - 2026-10-27

### Adicionado

- Licença MIT: o Prospecta passa a ser open source.

### Alterado

- README reescrito: o que é o projeto, instalação passo a passo, como usar cada tela, a pontuação de
  oportunidade, onde ficam os dados e o aviso de responsabilidade.

## [0.1.0] - 2026-10-26

### Adicionado

- Página 404 ("Essa página saiu do funil") para endereços que não existem, com atalhos para a busca e para os
  leads, e tela de erro quando uma página quebra.
- Padrão de projeto em `CLAUDE.md`: Git Flow, Conventional Commits, travas com husky, commitlint,
  lint-staged e validate-branch-name, Prettier, CI no GitHub Actions e template de PR.
- Versão do app exposta em `__APP_VERSION__`.
- Até 10 modelos de mensagem na tela Mensagens, com o modelo em uso aplicado no botão de WhatsApp e no detalhe
  do lead. A configuração antiga, com um único modelo, é migrada automaticamente.
- Coluna Instagram na lista de leads, com botão que abre o perfil do negócio ou "Não consta" quando não há.
- Escolha do modelo de mensagem no detalhe do lead, antes de enviar no WhatsApp.

### Alterado

- Prévia da mensagem no balão verde do WhatsApp, logo do WhatsApp no botão de contato e logo da sidebar maior.
- O seletor Lista/Pipeline vai para a linha dos filtros, com o título "Modo de visualização" e a opção ativa em
  destaque.
- A oportunidade do lead passa de Quente / Morno / Frio para Alta / Média / Baixa.
- As colunas da lista de leads ficaram centralizadas.
- O detalhe do lead abre num modal, com a mensagem de um lado e o acompanhamento do outro.
- No modal do lead, os botões "Chamar no WhatsApp" e "Ver no Instagram" viraram pílulas centralizadas, com o degradê
  e o ícone de cada marca, e o nome do negócio e os títulos ficaram maiores.
- Nova tela de busca: centralizada, com quantidade de negócios (10 a 100) no lugar da profundidade, buscas
  recentes e resumo dos leads.

### Removido

- A etiqueta de presença ("Sem site", "Só rede social") no topo do modal do lead.
- Botão Copiar do detalhe do lead.
- Coluna Presença da lista de leads: a coluna Instagram e o filtro de presença já cobrem essa informação.
- Filtros de busca e de telefone na tela de Leads. Quem abre uma busca pelo Histórico vê uma etiqueta para
  remover o filtro.

### Corrigido

- Emojis como 👉 chegavam no WhatsApp como "�": o link de contato passa a usar `api.whatsapp.com`.

[Não lançado]: https://github.com/probuled/prospecta/compare/v0.3.0...develop
[0.3.0]: https://github.com/probuled/prospecta/compare/v0.2.2...v0.3.0
[0.2.2]: https://github.com/probuled/prospecta/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/probuled/prospecta/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/probuled/prospecta/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/probuled/prospecta/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/probuled/prospecta/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/probuled/prospecta/releases/tag/v0.1.0
