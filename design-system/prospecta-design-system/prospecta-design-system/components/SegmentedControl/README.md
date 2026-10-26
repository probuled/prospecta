# SegmentedControl

Alternador entre 2–4 opções mutuamente exclusivas que trocam a visualização (Lista/Pipeline, tema).

- `options: {value, label, icon?}[]`, `value`/`defaultValue`, `onChange`, `iconOnly` (rótulo vira tooltip e `aria-label`), `block` (ocupa a largura).
- Trilho `surface-sunken`, item ativo `surface` com contorno `line`. Não use para filtros — filtro é `Select`.
