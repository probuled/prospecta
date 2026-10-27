# Changelog

Todas as mudanças relevantes do projeto ficam registradas aqui.

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto usa
[Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

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
