# SearchBar

A barra principal de busca: Nicho + Cidade + botão primário, numa peça de 56px.

- Props: `niche`, `city` (valores iniciais), placeholders, `onSubmit`, `busy` (desabilita e mostra "Buscando…"), `submitLabel` (padrão "Buscar leads").
- O consumidor controla o autocomplete; a barra só fornece o layout. Rótulos internos em `overline` (caixa alta 11px).
- Uma por tela, no topo da página Buscar, seguida de `TagList` de sugestões.
