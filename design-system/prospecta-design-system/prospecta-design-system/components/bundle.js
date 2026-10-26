/* @ds-bundle: {"format":4,"namespace":"Prospecta","components":[{"name":"Logo"},{"name":"Icon"},{"name":"Button"},{"name":"SegmentedControl"},{"name":"SearchBar"},{"name":"Input"},{"name":"Select"},{"name":"TagList"},{"name":"Switch"},{"name":"Slider"},{"name":"Panel"},{"name":"Disclosure"},{"name":"MetricStrip"},{"name":"Score"},{"name":"Presence"},{"name":"Rating"},{"name":"Status"},{"name":"LeadTable"},{"name":"PipelineCard"},{"name":"PipelineBoard"},{"name":"Sidebar"}]} */
(function () {
  var React = window.React, h = React.createElement, useState = React.useState;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function rest(p, omit) { var o = {}; for (var k in p) if (omit.indexOf(k) < 0) o[k] = p[k]; return o; }

  /* ---------- Icon (traço 1.5, grade 24, estilo Lucide) ---------- */
  var P = {
    search: [['circle', { cx: 11, cy: 11, r: 7 }], ['path', { d: 'm20 20-4-4' }]],
    pin: [['path', { d: 'M19 10c0 5-7 11.5-7 11.5S5 15 5 10a7 7 0 0 1 14 0Z' }], ['circle', { cx: 12, cy: 10, r: 2.5 }]],
    'chevron-down': [['path', { d: 'm6 9 6 6 6-6' }]],
    whatsapp: [['path', { d: 'M7.9 20A9 9 0 1 0 4 16.1L2.5 21.5Z' }]],
    list: [['path', { d: 'M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01' }]],
    columns: [['rect', { x: 3, y: 4, width: 18, height: 16, rx: 2 }], ['path', { d: 'M9 4v16M15 4v16' }]],
    download: [['path', { d: 'M12 4v11M7 10l5 5 5-5M4 20h16' }]],
    sliders: [['path', { d: 'M4 7h10M18 7h2M4 17h4M12 17h8' }], ['circle', { cx: 16, cy: 7, r: 2 }], ['circle', { cx: 10, cy: 17, r: 2 }]],
    'globe-off': [['circle', { cx: 12, cy: 12, r: 9 }], ['path', { d: 'M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9' }], ['path', { d: 'M4 4l16 16' }]],
    at: [['circle', { cx: 12, cy: 12, r: 4 }], ['path', { d: 'M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8' }]],
    link: [['path', { d: 'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7' }]],
    users: [['circle', { cx: 9, cy: 8, r: 3.5 }], ['path', { d: 'M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5' }]],
    history: [['path', { d: 'M3.5 12a8.5 8.5 0 1 0 2.5-6L3.5 8.5M3.5 4v4.5H8M12 7.5V12l3 2' }]],
    message: [['path', { d: 'M20 15a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2Z' }]],
    sun: [['circle', { cx: 12, cy: 12, r: 3.5 }], ['path', { d: 'M12 3v2M12 19v2M5.6 5.6 7 7M17 17l1.4 1.4M3 12h2M19 12h2M5.6 18.4 7 17M17 7l1.4-1.4' }]],
    moon: [['path', { d: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z' }]],
    monitor: [['rect', { x: 3, y: 4, width: 18, height: 12, rx: 2 }], ['path', { d: 'M8 20h8M12 16v4' }]],
    'arrow-up-right': [['path', { d: 'M8 8h8v8M8 16l8-8' }]],
    smartphone: [['rect', { x: 6, y: 3, width: 12, height: 18, rx: 2 }], ['path', { d: 'M11 17.5h2' }]],
    star: [['path', { d: 'M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9Z', fill: 'currentColor', stroke: 'none' }]],
    plus: [['path', { d: 'M12 5v14M5 12h14' }]]
  };
  function Icon(p) {
    var size = p.size || 16, parts = P[p.name] || [];
    return h('svg', { className: cx('pr-icon', p.className), width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
      strokeWidth: p.strokeWidth || 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': p.label ? undefined : 'true', 'aria-label': p.label, role: p.label ? 'img' : undefined },
      parts.map(function (q, i) { return h(q[0], Object.assign({ key: i }, q[1])); }));
  }

  /* ---------- Logo ---------- */
  // Arquivos oficiais (assets/Logos). No app, troque pelos seus imports: <Logo src={{light, dark}} />.
  var LOGO = {
    wordmark: { light: '/_blob/6e2ece314e2d9f9a23e6ec30ecd204c7', dark: '/_blob/abeadfb51bb916d3dd620512c8999617', ratio: 1469 / 434 },
    symbol: { light: '/_blob/da47a8fb3065c102be4935a57fb892b3', dark: '/_blob/a376efbbcfc558f7dfd9a27f52bffc78', ratio: 1 }
  };
  function Logo(p) {
    var v = p.variant === 'symbol' ? 'symbol' : 'wordmark', d = LOGO[v], src = p.src || d, height = p.height || 28;
    var st = { height: height, width: Math.round(height * d.ratio) };
    return h('span', { className: cx('pr-logo', 'pr-logo-' + v, p.className), role: 'img', 'aria-label': 'Prospecta' },
      h('img', { className: 'pr-logo-light', src: src.light, alt: '', style: st, draggable: false }),
      h('img', { className: 'pr-logo-dark', src: src.dark, alt: '', style: st, draggable: false }));
  }

  /* ---------- Button ---------- */
  function Button(p) {
    var v = p.variant || 'secondary', s = p.size || 'md';
    return h('button', Object.assign({ type: 'button' }, rest(p, ['variant', 'size', 'icon', 'iconOnly', 'className', 'children']), {
      className: cx('pr-btn', 'pr-btn-' + v, s !== 'md' && 'pr-btn-' + s, p.iconOnly && 'pr-btn-icon', p.className) }),
      p.icon && h(Icon, { name: p.icon, size: s === 'sm' ? 14 : 16 }), p.iconOnly ? null : p.children);
  }

  /* ---------- SegmentedControl ---------- */
  function SegmentedControl(p) {
    var st = useState(p.defaultValue || (p.options[0] && p.options[0].value)); var val = p.value !== undefined ? p.value : st[0];
    return h('div', { className: cx('pr-seg', p.iconOnly && 'pr-seg-icon', p.block && 'pr-seg-block'), role: 'group', 'aria-label': p.label },
      p.options.map(function (o) {
        return h('button', { key: o.value, type: 'button', 'aria-pressed': String(o.value === val), title: p.iconOnly ? o.label : undefined, 'aria-label': p.iconOnly ? o.label : undefined,
          onClick: function () { st[1](o.value); p.onChange && p.onChange(o.value); } }, o.icon && h(Icon, { name: o.icon, size: 15 }), p.iconOnly ? null : o.label);
      }));
  }

  /* ---------- SearchBar ---------- */
  function SearchBar(p) {
    return h('form', { className: 'pr-search', role: 'search', onSubmit: function (e) { e.preventDefault(); p.onSubmit && p.onSubmit(); } },
      h('div', { className: 'pr-search-field' }, h(Icon, { name: 'search', size: 18 }),
        h('label', null, h('span', null, p.nicheLabel || 'Nicho'), h('input', { defaultValue: p.niche, placeholder: p.nichePlaceholder || 'Ex.: barbearias' }))),
      h('div', { className: 'pr-search-field' }, h(Icon, { name: 'pin', size: 18 }),
        h('label', null, h('span', null, p.cityLabel || 'Cidade'), h('input', { defaultValue: p.city, placeholder: p.cityPlaceholder || 'Ex.: Recife, PE' }))),
      h(Button, { variant: 'primary', type: 'submit', icon: 'search', disabled: p.busy }, p.busy ? 'Buscando…' : (p.submitLabel || 'Buscar leads')));
  }

  /* ---------- Input ---------- */
  function Input(p) {
    return h('label', { className: cx('pr-input', p.className), style: p.width ? { width: p.width } : undefined },
      p.icon && h(Icon, { name: p.icon }), h('input', rest(p, ['icon', 'className', 'width'])));
  }

  /* ---------- Select (gatilho de filtro) ---------- */
  function Select(p) {
    return h('button', Object.assign({ type: 'button', 'aria-haspopup': 'listbox' }, rest(p, ['label', 'value', 'active', 'size', 'icon']), {
      className: cx('pr-select', p.size === 'sm' && 'pr-select-sm'), 'data-active': p.active ? 'true' : undefined }),
      p.icon && h(Icon, { name: p.icon }), p.label && h('span', { className: 'pr-select-k' }, p.label), h('span', null, p.value), h(Icon, { name: 'chevron-down', size: 14 }));
  }

  /* ---------- TagList ---------- */
  function TagList(p) {
    var st = useState(p.defaultSelected); var sel = p.selected !== undefined ? p.selected : st[0];
    return h('div', { className: 'pr-tags' }, p.label && h('span', { className: 'pr-tags-label' }, p.label),
      p.items.map(function (t) { return h('button', { key: t, type: 'button', className: 'pr-tag', 'aria-pressed': String(t === sel), onClick: function () { st[1](t); p.onSelect && p.onSelect(t); } }, t); }));
  }

  /* ---------- Switch ---------- */
  function Switch(p) {
    var st = useState(!!p.defaultChecked); var on = p.checked !== undefined ? p.checked : st[0];
    var sw = h('button', { type: 'button', role: 'switch', className: 'pr-switch', 'aria-checked': String(on), 'aria-label': p.title, onClick: function () { st[1](!on); p.onChange && p.onChange(!on); } });
    if (!p.title) return sw;
    return h('div', { className: 'pr-setting' }, h('div', null, h('div', { className: 'pr-setting-t' }, p.title), p.description && h('div', { className: 'pr-setting-d' }, p.description)), sw);
  }

  /* ---------- Slider ---------- */
  function Slider(p) {
    var min = p.min || 1, max = p.max || 10; var st = useState(p.defaultValue || min); var v = p.value !== undefined ? p.value : st[0];
    var pct = ((v - min) / (max - min)) * 100 + '%';
    return h('div', { className: 'pr-slider' },
      h('div', { className: 'pr-slider-head' }, h('b', null, p.label), h('span', { className: 'pr-mono pr-muted' }, p.format ? p.format(v) : v)),
      h('input', { type: 'range', min: min, max: max, value: v, style: { '--pct': pct }, 'aria-label': p.label, onChange: function (e) { st[1](+e.target.value); p.onChange && p.onChange(+e.target.value); } }),
      p.hint && h('div', { className: 'pr-setting-d' }, p.hint));
  }

  /* ---------- Panel / Disclosure ---------- */
  function Panel(p) {
    return h('section', { className: cx('pr-panel', p.className) },
      p.title && h('header', { className: 'pr-panel-head' }, h('h2', { className: 'pr-panel-title' }, p.title), p.action),
      h('div', { className: 'pr-panel-body' }, p.children));
  }
  function Disclosure(p) {
    var st = useState(!!p.defaultOpen); var open = st[0];
    return h('section', { className: 'pr-panel' },
      h('button', { type: 'button', className: 'pr-disc-head', 'aria-expanded': String(open), onClick: function () { st[1](!open); } },
        h(Icon, { name: p.icon || 'sliders' }), h('span', { className: 'pr-disc-t' }, p.title), p.summary && h('span', { className: 'pr-disc-s' }, p.summary), h(Icon, { name: 'chevron-down', className: 'pr-disc-chev' })),
      open && h('div', { className: 'pr-disc-body' }, p.children));
  }

  /* ---------- MetricStrip ---------- */
  function MetricStrip(p) {
    return h('div', { className: 'pr-metrics' }, p.items.map(function (m, i) {
      return h('div', { key: i, className: 'pr-metric' }, h('span', { className: 'pr-metric-l' }, m.label), h('span', { className: 'pr-metric-v' }, m.value), m.note && h('span', { className: 'pr-metric-n' }, m.note));
    }));
  }

  /* ---------- Score ---------- */
  function temp(v) { return v >= 80 ? 'quente' : v >= 50 ? 'morno' : 'frio'; }
  var WORDS = { quente: 'Quente', morno: 'Morno', frio: 'Frio' };
  function Score(p) {
    var t = temp(p.value), lit = Math.max(1, Math.round(p.value / 20)), bars = [];
    for (var i = 0; i < 5; i++) bars.push(h('i', { key: i, className: i < lit ? 'on' : '' }));
    return h('span', { className: cx('pr-score', 'pr-t-' + t, p.variant === 'badge' && 'pr-score-badge'), title: 'Oportunidade ' + p.value + '/100' },
      h('span', { className: 'pr-score-bars', 'aria-hidden': 'true' }, bars),
      h('span', { className: 'pr-score-n' }, p.value),
      p.showWord !== false && h('span', { className: 'pr-score-w' }, WORDS[t]));
  }

  /* ---------- Presence / Rating ---------- */
  var PRES = { 'sem-site': ['globe-off', 'Sem site'], 'rede-social': ['at', 'Só rede social'], site: ['link', 'Tem site'] };
  function Presence(p) { var d = PRES[p.kind] || PRES.site; return h('span', { className: 'pr-presence', 'data-kind': p.kind }, h(Icon, { name: d[0], size: 15 }), d[1]); }
  function fmt1(n) { return Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }); }
  function Rating(p) { return h('span', { className: 'pr-rating' }, h(Icon, { name: 'star', size: 13 }), h('b', null, fmt1(p.value)), p.count != null && h('small', null, '(' + Number(p.count).toLocaleString('pt-BR') + ')')); }

  /* ---------- Status ---------- */
  var STATUS = { novo: 'Novo', contatado: 'Contatado', respondeu: 'Respondeu', negociando: 'Negociando', fechado: 'Fechado', perdido: 'Perdido' };
  function Status(p) {
    var inner = [h('i', { key: 'm', className: 'pr-mark', 'data-s': p.status }), h('span', { key: 'l' }, STATUS[p.status] || p.status)];
    if (p.static) return h('span', { className: 'pr-status', style: { cursor: 'default' } }, inner);
    return h('button', { type: 'button', className: 'pr-status', 'aria-haspopup': 'listbox' }, inner, h(Icon, { key: 'c', name: 'chevron-down', size: 14 }));
  }

  /* ---------- LeadTable ---------- */
  function WhatsButton(p) { return h(Button, { size: 'sm', iconOnly: true, icon: 'whatsapp', className: 'pr-btn-whatsapp', 'aria-label': 'Abrir WhatsApp de ' + p.name, title: 'Abrir WhatsApp' }); }
  function LeadTable(p) {
    return h('div', { className: 'pr-table-wrap' }, h('table', { className: 'pr-table' },
      h('thead', null, h('tr', null, ['Negócio', 'Oportunidade', 'Presença', 'Avaliação', 'Contato'].map(function (c) { return h('th', { key: c }, c); }), h('th', { className: 'pr-r' }, 'Status'))),
      h('tbody', null, p.leads.map(function (l, i) {
        return h('tr', { key: i },
          h('td', null, h('div', { className: 'pr-biz' }, h('b', null, l.name), h('small', null, l.category + ' · ' + l.city))),
          h('td', null, h(Score, { value: l.score })),
          h('td', null, h(Presence, { kind: l.presence })),
          h('td', null, h(Rating, { value: l.rating, count: l.reviews })),
          h('td', null, h('span', { className: 'pr-contact' }, h(WhatsButton, { name: l.name }), h('span', { className: 'pr-mono' }, l.phone))),
          h('td', { className: 'pr-r' }, h(Status, { status: l.status || 'novo' })));
      }))));
  }

  /* ---------- Pipeline ---------- */
  function PipelineCard(p) {
    var l = p.lead;
    return h('article', { className: 'pr-pcard', tabIndex: 0, 'data-dragging': p.dragging ? 'true' : undefined },
      h('div', null, h('div', { className: 'pr-pcard-name' }, l.name), h('div', { className: 'pr-pcard-meta' }, l.category + ' · ' + l.city)),
      h('div', { className: 'pr-pcard-foot' }, h(Score, { value: l.score }), h('span', { className: 'pr-contact' }, h(Rating, { value: l.rating }), h(WhatsButton, { name: l.name }))));
  }
  function PipelineBoard(p) {
    return h('div', { className: 'pr-board' }, p.columns.map(function (c) {
      return h('div', { key: c.status, className: 'pr-lane' },
        h('div', { className: 'pr-lane-head' }, h('i', { className: 'pr-mark', 'data-s': c.status }), STATUS[c.status], h('span', { className: 'pr-mono' }, c.leads.length)),
        c.leads.length ? c.leads.map(function (l, i) { return h(PipelineCard, { key: i, lead: l, dragging: l.dragging }); }) : h('div', { className: 'pr-lane-empty' }, 'Arraste um lead para cá'));
    }));
  }

  /* ---------- Sidebar ---------- */
  function Sidebar(p) {
    var items = p.items || [{ id: 'buscar', label: 'Buscar', icon: 'search' }, { id: 'leads', label: 'Leads', icon: 'users', count: 40 }, { id: 'historico', label: 'Histórico', icon: 'history' }, { id: 'mensagem', label: 'Mensagem', icon: 'message' }];
    return h('aside', { className: 'pr-side' },
      h('div', { className: 'pr-side-brand' }, p.collapsed ? h(Logo, { variant: 'symbol', height: 28 }) : h(Logo, { height: 34 })),
      h('nav', { className: 'pr-nav', 'aria-label': 'Principal' }, items.map(function (it) {
        return h('a', { key: it.id, href: '#' + it.id, 'aria-current': it.id === p.current ? 'page' : undefined, onClick: function (e) { e.preventDefault(); p.onNavigate && p.onNavigate(it.id); } },
          h(Icon, { name: it.icon, size: 17 }), h('span', null, it.label), it.count != null && h('span', { className: 'pr-mono' }, it.count));
      })),
      h('div', { className: 'pr-side-foot' },
        h('div', { className: 'pr-engine', 'data-off': p.engineOnline === false ? 'true' : undefined }, h('i'), p.engineOnline === false ? 'Motor parado' : 'Motor online', p.engineNote && h('small', null, p.engineNote)),
        h(SegmentedControl, { block: true, iconOnly: true, label: 'Tema', defaultValue: p.theme || 'light', onChange: p.onThemeChange,
          options: [{ value: 'light', label: 'Claro', icon: 'sun' }, { value: 'dark', label: 'Escuro', icon: 'moon' }, { value: 'system', label: 'Sistema', icon: 'monitor' }] })));
  }

  var NS = { Logo: Logo, Icon: Icon, Button: Button, SegmentedControl: SegmentedControl, SearchBar: SearchBar, Input: Input, Select: Select, TagList: TagList, Switch: Switch, Slider: Slider,
    Panel: Panel, Disclosure: Disclosure, MetricStrip: MetricStrip, Score: Score, Presence: Presence, Rating: Rating, Status: Status, LeadTable: LeadTable, PipelineCard: PipelineCard,
    PipelineBoard: PipelineBoard, Sidebar: Sidebar, scoreTemperature: temp };
  window.Prospecta = Object.assign(window.Prospecta || {}, NS);
})();
