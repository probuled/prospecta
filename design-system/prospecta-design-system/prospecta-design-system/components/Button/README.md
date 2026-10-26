# Button

Botão de ação. **Primário (ouro) no máximo uma vez por tela** — é a coisa que a página existe para fazer ("Buscar leads", "Salvar mensagem").

- `variant`: `"secondary"` (padrão, borda `line` sobre `surface`), `"primary"`, `"ghost"` (ações terciárias como "Restaurar padrão").
- `size`: `"sm"` 28px (dentro de tabela/card), `"md"` 36px, `"lg"` 44px. `icon` (nome do Icon) e `iconOnly` — com `iconOnly`, passe `aria-label`.
- Rótulo: verbo no infinitivo, sentence case, sem ponto: "Exportar", "Nova busca". Nada de "Clique aqui".
- Desabilitado é cinza (`surface-sunken` + `ink-faint`), nunca um ouro pálido — o ouro pálido parece um primário quebrado.
