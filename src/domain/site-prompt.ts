import { findInstagram } from './instagram'
import type { Lead } from './lead'
import type { NeighborComparison } from './neighbor-comparison'
import { buildWhatsAppUrl, parsePhone } from './phone'
import { profileChecklist } from './profile-checklist'
import { bestReviews, findPains, firstName } from './review-insights'
import { STYLE_DIRECTIONS, styleOf, type SiteStyle } from './site-prompt-styles'

export const SITE_TARGETS = ['html', 'react'] as const

export type SiteTarget = (typeof SITE_TARGETS)[number]

export const SITE_TARGET_LABELS: Record<SiteTarget, string> = {
  html: 'HTML + CSS',
  react: 'React + TailwindCSS',
}

export interface SitePromptOptions {
  readonly target: SiteTarget
  readonly style: SiteStyle
  /** Observações de quem vende: o que destacar, pedido do dono, tom. */
  readonly notes: string
}

export function defaultSitePromptOptions(lead: Lead): SitePromptOptions {
  return { target: 'html', style: styleOf(lead.category), notes: '' }
}

/** O que o prompt conseguiu reunir sobre o lead, para mostrar na tela antes de copiar. */
export interface SitePromptCoverage {
  readonly photos: number
  readonly reviews: number
  readonly hasHours: boolean
  readonly hasDescription: boolean
  readonly hasLocation: boolean
  readonly hasWhatsApp: boolean
  readonly pains: number
}

const PAIN_SOLUTIONS: Record<string, string> = {
  contato: 'botão de WhatsApp fixo em todas as telas e o telefone clicável no topo e no rodapé',
  agendamento: 'chamada clara para agendar pelo WhatsApp e uma seção "como funciona" em 3 passos',
  informacao:
    'horários bem visíveis e uma seção de serviços (ou cardápio) com os itens principais, preços marcados [confirmar com o cliente]',
  localizacao: 'mapa incorporado, endereço completo e um botão "Como chegar" que abre o Google Maps',
}

const MAX_TESTIMONIALS = 5
const MAX_TESTIMONIAL_LENGTH = 400
/** Com menos fotos que isso, a galeria vira espaço reservado para as fotos do cliente. */
const MIN_PHOTOS_FOR_GALLERY = 4

const WEEK_DAYS = ['segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado', 'domingo']

/** Texto numa linha só, cortado em palavra inteira: avaliação com quebra de linha quebraria a citação em Markdown. */
function singleLine(text: string, maxLength: number): string {
  const flat = text.replace(/\s+/g, ' ').trim()
  if (flat.length <= maxLength) return flat
  return `${flat.slice(0, maxLength).replace(/\s+\S*$/, '')}…`
}

/** O Google costuma repetir o nome do negócio no começo do endereço. */
function cleanAddress(lead: Lead): string {
  const prefix = `${lead.name} - `
  return lead.address.startsWith(prefix) ? lead.address.slice(prefix.length) : lead.address
}

/** Link do Maps sem os parâmetros de rastreio da sessão de busca. */
function cleanMapsUrl(url: string): string {
  return url.split('?')[0] ?? url
}

function line(label: string, value: string | number | null | undefined): string[] {
  return value === null || value === undefined || value === '' ? [] : [`- **${label}:** ${value}`]
}

function section(title: string, body: readonly string[]): string {
  return body.length === 0 ? '' : `## ${title}\n\n${body.join('\n')}`
}

function photosOf(lead: Lead): { readonly title: string; readonly url: string }[] {
  const profile = lead.profile
  if (!profile) return []
  const images = profile.images.map((image, index) => ({ title: image.title || `Foto ${index + 1}`, url: image.url }))
  const cover = profile.thumbnailUrl && !images.some((image) => image.url === profile.thumbnailUrl)
  return [...(cover ? [{ title: 'Foto de capa do Google', url: profile.thumbnailUrl }] : []), ...images]
}

export function sitePromptCoverage(lead: Lead): SitePromptCoverage {
  const profile = lead.profile
  return {
    photos: photosOf(lead).length,
    reviews: bestReviews(lead, MAX_TESTIMONIALS).length,
    hasHours: Object.keys(profile?.openingHours ?? {}).length > 0,
    hasDescription: Boolean(profile?.description),
    hasLocation: Boolean(lead.location),
    hasWhatsApp: parsePhone(lead.phone)?.isMobile ?? false,
    pains: findPains(lead).length,
  }
}

function businessData(lead: Lead): string {
  const profile = lead.profile
  const phone = parsePhone(lead.phone)
  const instagram = findInstagram(lead.website)
  const ratings = profile?.reviewsPerRating.some(Boolean)
    ? profile.reviewsPerRating.map((count, index) => `${index + 1}★: ${count}`).join(' · ')
    : ''

  return section('Dados do negócio (fonte: Google Maps)', [
    ...line('Nome', lead.name),
    ...line('Categoria', lead.category),
    ...line('Endereço', cleanAddress(lead)),
    ...line('Bairro', profile?.neighborhood),
    ...line('Cidade', lead.city),
    ...line('Telefone', lead.phone ? `${lead.phone} (link: tel:+${phone?.digits ?? ''})` : ''),
    ...line('WhatsApp', phone?.isMobile ? buildWhatsAppUrl(phone, 'Olá! Vim pelo site e quero mais informações.') : ''),
    ...line('E-mail', lead.emails.join(', ')),
    ...line('Instagram', instagram ? (instagram.handle ? `@${instagram.handle} (${instagram.url})` : instagram.url) : ''),
    ...line('Site ou link atual', instagram ? '' : lead.website),
    ...line('Nota no Google', lead.rating ? `${lead.rating.toFixed(1)} de 5, com ${lead.reviewCount} avaliações` : ''),
    ...line('Avaliações por estrela', ratings),
    ...line('Faixa de preço', profile?.priceRange),
    ...line('Situação no Google', profile?.businessStatus),
    ...line('Cardápio', profile?.menuUrl),
    ...line('Pedido online', profile?.orderOnlineUrls.join(', ')),
    ...line('Agendamento online', profile?.reservationUrls.join(', ')),
    ...line('Página no Google Maps', lead.mapsUrl && cleanMapsUrl(lead.mapsUrl)),
    ...line('Coordenadas', lead.location ? `${lead.location.lat}, ${lead.location.lon}` : ''),
  ])
}

/** Posição na semana, a partir de segunda; dia com outro nome vai para o fim. */
function dayPosition(day: string): number {
  const index = WEEK_DAYS.indexOf(day.toLowerCase())
  return index === -1 ? WEEK_DAYS.length : index
}

function openingHours(lead: Lead): string {
  const hours = Object.entries(lead.profile?.openingHours ?? {})
  if (hours.length === 0)
    return section('Horário de funcionamento', ['Não informado no Google. Mostre o bloco de horários como [confirmar com o cliente].'])
  return section(
    'Horário de funcionamento',
    hours.toSorted(([a], [b]) => dayPosition(a) - dayPosition(b)).map(([day, ranges]) => `- ${day}: ${ranges.join(' e ') || 'Fechado'}`),
  )
}

function photos(lead: Lead): string {
  const list = photosOf(lead)
  const logo =
    'Não há logo disponível. Crie um logotipo tipográfico (wordmark) em SVG inline com o nome do negócio, coerente com a direção de arte. Se uma das fotos mostrar a fachada com letreiro, inspire-se nas cores e no estilo dele.'
  if (list.length === 0) {
    return section('Fotos e logo', [
      'Não há fotos do negócio. Não use banco de imagens genérico: construa o visual com tipografia, cor, formas e padrões, e deixe 2 ou 3 espaços marcados [foto do cliente] onde fotos reais entrariam.',
      '',
      logo,
    ])
  }
  return section('Fotos e logo', [
    'Use estas URLs direto nas tags <img> (são públicas). A primeira é a melhor candidata para o topo. Não troque por fotos de banco de imagens.',
    '',
    ...list.map((photo) => `- ${photo.title}: ${photo.url}`),
    ...(list.length < MIN_PHOTOS_FOR_GALLERY
      ? [
          '',
          `Só ${list.length === 1 ? 'há 1 foto' : `há ${list.length} fotos`}: use no topo e, em qualquer galeria, complete com espaços elegantes marcados [foto do cliente] em vez de repetir a mesma imagem.`,
        ]
      : []),
    '',
    logo,
  ])
}

function testimonials(lead: Lead): string {
  const reviews = bestReviews(lead, MAX_TESTIMONIALS)
  if (reviews.length === 0) return ''
  return section('O que os clientes dizem (avaliações reais do Google)', [
    'Use como depoimentos, com o texto exato e só o primeiro nome. Também são a melhor fonte para o título e os diferenciais: repare no que se repete.',
    '',
    ...reviews.map(
      (review) =>
        `> "${singleLine(review.text, MAX_TESTIMONIAL_LENGTH)}" — ${firstName(review.author) || 'Cliente no Google'}, ${review.rating}★`,
    ),
  ])
}

function pains(lead: Lead): string {
  const found = findPains(lead)
  if (found.length === 0) return ''
  return section('Reclamações que o site deve resolver', [
    'Avaliações negativas citam estes problemas. O site não fala deles; resolve com estrutura:',
    '',
    ...found.map((pain) => `- ${pain.label} ("${pain.quote}") → ${PAIN_SOLUTIONS[pain.id] ?? 'deixe a informação clara e fácil de achar'}`),
  ])
}

function market(lead: Lead, comparison: NeighborComparison | null): string {
  const missing = (profileChecklist(lead) ?? []).filter((item) => !item.isDone).map((item) => item.label.toLowerCase())
  return section('Contexto de mercado', [
    ...(comparison
      ? [
          `- ${comparison.peersWithSite} de ${comparison.peers} concorrentes da mesma categoria num raio de ${comparison.radiusKm} km já têm site. Eles têm em média ${comparison.peersAverageReviews} avaliações; este negócio tem ${lead.reviewCount}.`,
        ]
      : []),
    ...(missing.length > 0 ? [`- O perfil no Google hoje está sem: ${missing.join(', ')}.`] : []),
    ...(comparison || missing.length > 0
      ? ['- Posicione o negócio como a escolha óbvia do bairro: destaque o que as avaliações mais elogiam e a nota.']
      : []),
  ])
}

function artDirection(style: SiteStyle): string {
  const direction = STYLE_DIRECTIONS[style]
  return section('Direção de arte (ponto de partida; ajuste ao que as fotos mostram)', [
    `- **Clima:** ${direction.mood}`,
    `- **Paleta:** ${direction.palette.join('; ')}. Se as fotos ou o letreiro tiverem cores fortes da marca, adapte a paleta a elas.`,
    `- **Tipografia (Google Fonts):** ${direction.typography} No máximo 2 famílias.`,
    `- **Imagens:** ${direction.imagery}`,
  ])
}

function pageStructure(lead: Lead, style: SiteStyle): string {
  const direction = STYLE_DIRECTIONS[style]
  const place = [lead.profile?.neighborhood, lead.city].filter(Boolean).join(', ')
  const mapEmbed = lead.location
    ? `incorpore o mapa com <iframe src="https://www.google.com/maps?q=${lead.location.lat},${lead.location.lon}&z=16&output=embed" loading="lazy">`
    : 'incorpore o mapa do Google pelo endereço'
  return section('Estrutura da página, nesta ordem', [
    `1. **Cabeçalho fixo:** wordmark à esquerda; à direita, o botão "${direction.primaryAction}". No celular, só o wordmark e o botão.`,
    `2. **Topo (hero):** título curto e específico (nada de "Bem-vindo"), tirado do que os clientes mais elogiam; subtítulo com a categoria e ${place || 'a cidade'}; nota e número de avaliações do Google; botão principal "${direction.primaryAction}"; a melhor foto.`,
    '3. **Faixa de prova social:** nota média, total de avaliações e 1 frase curta de depoimento.',
    ...direction.sections.map((item, index) => `${index + 4}. **${item}.**`),
    `${direction.sections.length + 4}. **Depoimentos:** os das avaliações acima, em cards ou carrossel simples.`,
    `${direction.sections.length + 5}. **Sobre:** 2 parágrafos curtos na voz do dono. Use a descrição do Google se houver; senão, escreva a partir das avaliações, sem inventar fatos.`,
    `${direction.sections.length + 6}. **Horários e localização:** tabela de horários destacando o dia de hoje; endereço; ${mapEmbed}; botão "Como chegar".`,
    `${direction.sections.length + 7}. **Perguntas frequentes:** 4 ou 5, respondidas só com os dados deste prompt (horário, endereço, como agendar ou pedir, formas de contato).`,
    `${direction.sections.length + 8}. **Chamada final:** frase curta e o botão principal de novo.`,
    `${direction.sections.length + 9}. **Rodapé:** nome, endereço, telefone (mesmo formato em todo o site), links e "Site criado por [seu nome]".`,
    `- **Botão flutuante de WhatsApp** no canto inferior direito, sempre visível no celular.`,
  ])
}

const DESIGN_STANDARDS = section('Padrão de design (trabalhe como um diretor de arte sênior)', [
  '- **Hierarquia:** uma ideia por seção, um único botão principal (o mesmo em toda a página), títulos que se entendem sem ler o resto.',
  '- **Tipografia:** escala modular de razão 1,25; títulos grandes com espaçamento entre letras levemente negativo; texto com 16–18px, altura de linha 1,5–1,7 e no máximo 70 caracteres por linha.',
  '- **Espaço:** grade de 8px; seções com 96–128px de respiro vertical no computador e 64px no celular; alinhamento consistente à mesma coluna.',
  '- **Cor:** regra 60-30-10 (fundo, apoio, destaque); contraste mínimo WCAG AA (4,5:1 no texto, 3:1 em títulos grandes e ícones).',
  '- **Celular primeiro:** projete para 390px de largura antes do computador; áreas de toque com pelo menos 44px; o botão principal aparece sem rolar.',
  '- **Acabamento:** cantos arredondados consistentes, bordas sutis, sombras suaves vindas de uma direção só, estados de hover e foco visíveis, transições de 150–250ms. Animações só de entrada, discretas, e desligadas com prefers-reduced-motion.',
  '- **Fotos:** proporções consistentes, object-fit: cover, loading="lazy" em todas menos a do topo, texto alternativo descritivo.',
  '- **Texto (copy):** português do Brasil, frases curtas e concretas, na voz do dono; use detalhes reais das avaliações. Botões com verbo ("Agendar horário", não "Saiba mais").',
  '- **Evite a cara de site feito por IA:** nada de degradê roxo e azul, vidro fosco sem motivo, emoji como ícone, "Bem-vindo ao nosso site", "qualidade e excelência", lorem ipsum, três cards iguais com ícones aleatórios ou foto de banco com gente sorrindo para a câmera.',
])

function technical(style: SiteStyle): string {
  return section('SEO local e parte técnica', [
    '- `<html lang="pt-BR">`, um único `<h1>`, HTML semântico (header, main, section, footer) e links `tel:` e de WhatsApp clicáveis.',
    '- `<title>` no formato "Nome | Categoria em Bairro, Cidade" e meta description de até 155 caracteres com a nota e o bairro.',
    '- Open Graph (og:title, og:description, og:image com a foto do topo), para o link ficar bonito no WhatsApp.',
    `- JSON-LD do schema.org com o tipo ${STYLE_DIRECTIONS[style].schemaType}: name, address, telephone, geo, openingHoursSpecification, aggregateRating e sameAs com o Google Maps e o Instagram, se houver.`,
    '- Desempenho: fontes com display=swap, imagens com width e height, nenhuma biblioteca pesada.',
  ])
}

const HONESTY_RULES = section('Regras de honestidade', [
  '- Use só os dados deste prompt. Não invente preço, prêmio, tempo de mercado, número de clientes, nome de profissional ou serviço que as avaliações não citem.',
  '- O que faltar e for importante, marque visivelmente no site como [confirmar com o cliente].',
  '- Depoimentos com o texto exato das avaliações e só o primeiro nome do autor.',
])

const DELIVERY: Record<SiteTarget, string> = {
  html: section('Entrega', [
    '- Um único arquivo index.html completo, com o CSS em <style> e o JavaScript mínimo em <script>. A única dependência externa permitida é o Google Fonts.',
    '- Pronto para abrir no navegador e publicar como está. Entregue o código completo, sem trechos omitidos e sem explicações longas.',
    '- Se o ambiente tiver skills ou ferramentas de design de interface (por exemplo, a skill "frontend-design"), use-as.',
  ]),
  react: section('Entrega', [
    '- Uma página em React + TypeScript + Tailwind CSS, com um componente por seção e os dados do negócio num objeto `business` no topo do arquivo principal.',
    '- Ícones do lucide-react; nenhuma outra biblioteca de interface.',
    '- Se o ambiente tiver skills ou ferramentas de design de interface (por exemplo, a skill "frontend-design"), use-as.',
  ]),
}

const FINAL_CHECK = section('Antes de entregar, confira', [
  '- [ ] O botão principal leva ao WhatsApp (ou ao telefone, se não houver WhatsApp) e aparece no topo sem rolar.',
  '- [ ] Nome, endereço e telefone estão idênticos em todo o site e no JSON-LD.',
  '- [ ] Nenhum texto genérico de modelo, nenhum lorem ipsum, nenhum dado inventado.',
  '- [ ] Funciona bem em 390px e em 1440px; contraste AA em todo o texto.',
  '- [ ] As fotos usadas são as URLs deste prompt.',
])

/** O prompt completo para uma IA criar o site do lead. Seções sem dados não entram. */
export function buildSitePrompt(lead: Lead, options: SitePromptOptions, comparison: NeighborComparison | null): string {
  const place = [lead.profile?.neighborhood, lead.city].filter(Boolean).join(', ')
  const subject = [lead.category.toLowerCase(), place && `em ${place}`].filter(Boolean).join(' ')
  const intro = [
    `# Site para ${lead.name}`,
    '',
    `Você é um diretor de arte e desenvolvedor front-end sênior, especialista em sites que geram clientes para negócios locais brasileiros. Crie a landing page de **${lead.name}**${subject ? `, ${subject}` : ''}.`,
    '',
    'Este site é uma demonstração para o dono do negócio, que ainda não tem um site próprio. Ele precisa abrir o link e pensar "isso é meu e ficou melhor do que eu imaginava": tem que parecer feito sob medida, com os dados e as fotos reais do negócio, e não um modelo genérico.',
  ].join('\n')

  const notes = options.notes.trim()
  return [
    intro,
    businessData(lead),
    openingHours(lead),
    lead.profile?.description ? section('Descrição oficial no Google', [lead.profile.description]) : '',
    photos(lead),
    testimonials(lead),
    pains(lead),
    market(lead, comparison),
    artDirection(options.style),
    pageStructure(lead, options.style),
    DESIGN_STANDARDS,
    technical(options.style),
    HONESTY_RULES,
    notes ? section('Observações de quem vai apresentar o site', [notes]) : '',
    DELIVERY[options.target],
    FINAL_CHECK,
  ]
    .filter(Boolean)
    .join('\n\n')
}
