# Changelog

Todas as mudanças relevantes do projeto ficam registradas aqui.

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto usa
[Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

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

[Não lançado]: https://github.com/probuled/prospecta/compare/v0.2.0...develop
[0.2.0]: https://github.com/probuled/prospecta/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/probuled/prospecta/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/probuled/prospecta/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/probuled/prospecta/releases/tag/v0.1.0
