export const SITE_STYLES = [
  'beleza',
  'comida',
  'saude',
  'pet',
  'fitness',
  'automotivo',
  'casa',
  'moda',
  'educacao',
  'profissional',
  'imoveis',
  'eventos',
  'hospedagem',
  'tecnologia',
  'geral',
] as const

export type SiteStyle = (typeof SITE_STYLES)[number]

export const SITE_STYLE_LABELS: Record<SiteStyle, string> = {
  beleza: 'Beleza e estética',
  comida: 'Restaurante e comida',
  saude: 'Saúde',
  pet: 'Pet shop e veterinária',
  fitness: 'Academia e esportes',
  automotivo: 'Oficina e automotivo',
  casa: 'Construção, reformas e casa',
  moda: 'Moda e loja',
  educacao: 'Escola e cursos',
  profissional: 'Advocacia, contabilidade e consultoria',
  imoveis: 'Imobiliária',
  eventos: 'Festas, eventos e fotografia',
  hospedagem: 'Hotel e pousada',
  tecnologia: 'Assistência técnica e informática',
  geral: 'Negócio local',
}

/** Direção de arte de cada nicho: o ponto de partida que a IA refina com os dados do negócio. */
export interface StyleDirection {
  readonly mood: string
  readonly palette: readonly string[]
  readonly typography: string
  readonly imagery: string
  /** Seções específicas do nicho, além das comuns a todo site. */
  readonly sections: readonly string[]
  readonly primaryAction: string
  /** Tipo do schema.org para o JSON-LD. */
  readonly schemaType: string
}

export const STYLE_DIRECTIONS: Record<SiteStyle, StyleDirection> = {
  beleza: {
    mood: 'Editorial e sofisticado, com cara de revista de estilo masculino ou feminino conforme o público. Muito respiro, fotos grandes, detalhes finos.',
    palette: [
      'carvão #1C1A17 (fundos escuros e texto)',
      'creme #F6F1EA (fundo principal)',
      'dourado envelhecido #B8862F (destaques e botão principal, com texto escuro por cima)',
      'cinza quente #625A51 (texto secundário)',
    ],
    typography:
      'Títulos em serifa de alto contraste (Playfair Display ou Fraunces, 600–800); texto em sans neutra (Inter ou DM Sans, 400–500).',
    imagery:
      'Fotos reais do espaço e de trabalhos feitos, em tons quentes. Recortes verticais, molduras finas, nada de ícones genéricos de tesoura.',
    sections: ['Serviços com duração aproximada (sem preço inventado)', 'Galeria de trabalhos em grade assimétrica'],
    primaryAction: 'Agendar horário pelo WhatsApp',
    schemaType: 'BeautySalon, HairSalon ou BarberShop (o que for mais próximo da categoria)',
  },
  comida: {
    mood: 'Quente, apetitoso e acolhedor. A comida é a estrela: fotos grandes, texturas, sensação de casa cheia.',
    palette: [
      'tomate #C2410C (botão principal, com texto branco)',
      'creme #FFF7ED (fundo principal)',
      'marrom café #2A1A12 (texto e fundos escuros)',
      'verde oliva #4D5B2A (detalhes e selos)',
    ],
    typography: 'Títulos em serifa expressiva (Fraunces ou Young Serif); texto em DM Sans ou Nunito Sans.',
    imagery: 'Fotos dos pratos e do ambiente, bem iluminadas, cortes fechados. Evite ilustrações infantis e clip-art de comida.',
    sections: [
      'Destaques do cardápio (use o link do cardápio se houver; sem preço inventado)',
      'Como pedir: delivery, retirada ou no local',
    ],
    primaryAction: 'Fazer pedido pelo WhatsApp (ou pelo link de pedido online, se houver)',
    schemaType: 'Restaurant ou outro FoodEstablishment adequado à categoria',
  },
  saude: {
    mood: 'Limpo, calmo e confiável. Transmite cuidado e competência sem parecer hospital frio.',
    palette: [
      'azul petróleo #0B6A85 (botão principal, com texto branco)',
      'branco gelo #F4F8FB (fundo principal)',
      'azul noite #0F2A3D (texto)',
      'verde menta #3BA58B (detalhes e ícones)',
    ],
    typography: 'Sans humanista em tudo: Plus Jakarta Sans ou Manrope nos títulos (600–700) e Source Sans 3 ou Inter no texto.',
    imagery:
      'Fotos do consultório e da equipe com luz natural. Ícones de linha finos e consistentes. Nada de banco de imagem com jaleco genérico.',
    sections: [
      'Especialidades e tratamentos',
      'Primeira consulta: como funciona, em 3 passos',
      'Convênios aceitos (marque como [confirmar com o cliente])',
    ],
    primaryAction: 'Marcar consulta pelo WhatsApp',
    schemaType: 'MedicalBusiness, Dentist ou MedicalClinic (o que for mais próximo da categoria)',
  },
  pet: {
    mood: 'Alegre, carinhoso e confiável. Os animais são os protagonistas; o tom é leve, mas mostra cuidado de verdade.',
    palette: [
      'laranja abóbora #E0702A (botão principal, com texto escuro #1F1A17 por cima)',
      'creme #FFF8F1 (fundo principal)',
      'azul marinho #1E3A5F (texto e títulos)',
      'verde água #5BB5A2 (detalhes e selos)',
    ],
    typography: 'Títulos arredondados e amigáveis (Nunito ou Baloo 2, 700–800); texto em Nunito Sans.',
    imagery:
      'Fotos reais dos pets atendidos e do espaço. Formas orgânicas e cantos bem arredondados. Nada de patinhas de clip-art espalhadas.',
    sections: [
      'Serviços: banho e tosa, consultas, vacinas, produtos (só os que as avaliações ou a categoria indicam)',
      'Busca e entrega, se as avaliações citarem (senão, [confirmar com o cliente])',
    ],
    primaryAction: 'Agendar banho ou consulta pelo WhatsApp',
    schemaType: 'PetStore ou VeterinaryCare (o que for mais próximo da categoria)',
  },
  fitness: {
    mood: 'Enérgico, forte e motivador, com contraste alto e ritmo. Passa resultado e comunidade, não só equipamento.',
    palette: [
      'preto grafite #111315 (fundos escuros)',
      'verde limão #B6F23A (botão principal e destaques, com texto preto por cima)',
      'branco #FFFFFF (texto sobre fundo escuro)',
      'cinza aço #6B7280 (texto secundário)',
    ],
    typography: 'Títulos condensados e fortes em caixa alta (Bebas Neue, Oswald ou Anton); texto em Inter.',
    imagery:
      'Fotos reais de treino e da estrutura, com movimento e luz dramática. Diagonais e cortes ousados. Nada de modelo de banco de imagem posando.',
    sections: [
      'Modalidades e aulas',
      'Estrutura e equipamentos',
      'Planos (sem preço inventado; use [confirmar com o cliente])',
      'Aula experimental',
    ],
    primaryAction: 'Agendar aula experimental pelo WhatsApp',
    schemaType: 'ExerciseGym ou SportsActivityLocation',
  },
  automotivo: {
    mood: 'Robusto, técnico e honesto. Transmite confiança e transparência, que é o que o cliente mais teme não ter numa oficina.',
    palette: [
      'grafite #1F2328 (fundos escuros e texto)',
      'amarelo segurança #F2B705 (botão principal, com texto preto por cima)',
      'cinza claro #F3F4F6 (fundo principal)',
      'vermelho #C0392B (detalhes pontuais)',
    ],
    typography: 'Títulos em sans larga e firme (Archivo ou Barlow, 700–800); texto em Inter.',
    imagery:
      'Fotos reais da oficina, das ferramentas e de serviços feitos. Texturas de metal com moderação. Nada de carro esportivo de banco de imagem.',
    sections: [
      'Serviços: mecânica, elétrica, funilaria, revisão (só os que a categoria ou as avaliações indicam)',
      'Como funciona o orçamento',
      'Garantia do serviço ([confirmar com o cliente])',
    ],
    primaryAction: 'Pedir orçamento pelo WhatsApp',
    schemaType: 'AutoRepair ou outro AutomotiveBusiness adequado',
  },
  casa: {
    mood: 'Sólido, organizado e profissional. Mostra capricho no acabamento e pontualidade, com antes e depois sempre que houver fotos.',
    palette: [
      'azul aço #24476B (botão principal, com texto branco)',
      'off-white #F8F7F4 (fundo principal)',
      'grafite #22262A (texto)',
      'laranja terracota #D9774B (destaques)',
    ],
    typography: 'Títulos em Manrope ou Work Sans (700); texto em Inter.',
    imagery: 'Fotos reais de obras e serviços, de preferência em pares de antes e depois. Linhas retas, grade organizada.',
    sections: [
      'Serviços oferecidos',
      'Trabalhos realizados (antes e depois, se houver fotos)',
      'Região atendida',
      'Como pedir orçamento, em 3 passos',
    ],
    primaryAction: 'Pedir orçamento pelo WhatsApp',
    schemaType: 'HomeAndConstructionBusiness ou o subtipo mais próximo (Electrician, Plumber, GeneralContractor…)',
  },
  moda: {
    mood: 'Contemporâneo e desejável, com cara de vitrine bem montada. Produto em destaque e muito espaço em branco.',
    palette: [
      'preto #141414 (texto e botão principal, com texto branco)',
      'off-white #FAFAF7 (fundo principal)',
      'rosa antigo #C98E8E ou a cor que dominar nas fotos (destaques)',
      'cinza #7A7A7A (texto secundário)',
    ],
    typography: 'Títulos em serifa elegante (Cormorant Garamond ou DM Serif Display); texto em Jost ou Inter.',
    imagery: 'Fotos dos produtos e da loja, em grade de vitrine. Recortes limpos, fundo neutro.',
    sections: ['Coleções ou categorias de produto', 'Vitrine com destaques', 'Formas de comprar: loja, WhatsApp, entrega'],
    primaryAction: 'Comprar pelo WhatsApp',
    schemaType: 'ClothingStore ou outro Store adequado à categoria',
  },
  educacao: {
    mood: 'Acolhedor, organizado e inspirador. Passa segurança para pais e motivação para alunos.',
    palette: [
      'azul royal #2952A3 (botão principal, com texto branco)',
      'branco #FFFFFF (fundo principal)',
      'amarelo #F5B82E (destaques)',
      'azul escuro #1B2A4A (texto)',
    ],
    typography: 'Títulos em Poppins ou Lexend (600–700); texto em Lexend ou Inter.',
    imagery: 'Fotos reais de salas, alunos e atividades (sem expor crianças sem autorização). Ícones de linha simples.',
    sections: ['Cursos ou turmas', 'Metodologia', 'Estrutura', 'Matrícula ou aula experimental'],
    primaryAction: 'Agendar visita ou aula experimental pelo WhatsApp',
    schemaType: 'EducationalOrganization ou School (o que for mais próximo da categoria)',
  },
  profissional: {
    mood: 'Sóbrio, sério e confiável, sem ser frio. Clareza acima de enfeite; credibilidade em cada detalhe.',
    palette: [
      'azul marinho #1B2B48 (texto e fundos escuros)',
      'off-white #F7F6F2 (fundo principal)',
      'bordô #7A2E3A ou dourado discreto #A8873E (botão principal, com texto claro)',
      'cinza #5C6370 (texto secundário)',
    ],
    typography: 'Títulos em serifa clássica (Libre Baskerville ou Source Serif 4); texto em Source Sans 3.',
    imagery: 'Fotos do escritório e do profissional, se houver. Sem martelo de juiz, balança ou aperto de mão de banco de imagem.',
    sections: ['Áreas de atuação', 'Como funciona o atendimento', 'Sobre o profissional ou o escritório'],
    primaryAction: 'Agendar uma conversa pelo WhatsApp',
    schemaType: 'LegalService, AccountingService ou ProfessionalService (o que for mais próximo da categoria)',
  },
  imoveis: {
    mood: 'Aspiracional e confiável. Fotos grandes de imóveis, navegação simples, sensação de mercado local bem conhecido.',
    palette: [
      'verde petróleo #1F4E4A (botão principal, com texto branco)',
      'areia #F5F1EA (fundo principal)',
      'grafite #23272A (texto)',
      'dourado #C59A4A (destaques)',
    ],
    typography: 'Títulos em DM Serif Display ou Playfair Display; texto em Inter.',
    imagery: 'Fotos dos imóveis e dos bairros atendidos, amplas e bem iluminadas.',
    sections: [
      'Imóveis em destaque ([confirmar com o cliente] se não houver fotos)',
      'Compra, venda e locação',
      'Bairros atendidos',
      'Avalie seu imóvel',
    ],
    primaryAction: 'Falar com um corretor pelo WhatsApp',
    schemaType: 'RealEstateAgent',
  },
  eventos: {
    mood: 'Festivo e memorável, com elegância. Emoção do dia especial, sem exagero de efeitos.',
    palette: [
      'vinho #6D2E46 (botão principal, com texto claro)',
      'champanhe #F7EFE5 (fundo principal)',
      'dourado #C9A15A (detalhes)',
      'grafite #2A2426 (texto)',
    ],
    typography: 'Títulos em serifa romântica (Cormorant Garamond ou Playfair Display, itálico nos destaques); texto em Lato ou Inter.',
    imagery: 'Fotos reais de eventos realizados, em galeria ampla. Luz quente, detalhes de decoração.',
    sections: [
      'Tipos de evento atendidos',
      'Galeria de eventos',
      'Pacotes (sem preço inventado; [confirmar com o cliente])',
      'Como reservar a data',
    ],
    primaryAction: 'Consultar data disponível pelo WhatsApp',
    schemaType: 'EventVenue, FoodEstablishment (buffet) ou ProfessionalService (fotografia), conforme a categoria',
  },
  hospedagem: {
    mood: 'Convidativo e tranquilo. Dá vontade de estar lá: luz natural, conforto, a região em volta.',
    palette: [
      'verde musgo #3F5B3A (botão principal, com texto branco)',
      'areia #F6F1E7 (fundo principal)',
      'terracota #C26A43 (destaques)',
      'marrom escuro #2B2420 (texto)',
    ],
    typography: 'Títulos em Fraunces ou Lora; texto em Inter ou Nunito Sans.',
    imagery: 'Fotos dos quartos, das áreas comuns e da paisagem, em tamanho grande.',
    sections: ['Acomodações', 'Comodidades (só as citadas nas avaliações ou nos dados)', 'A região e o que fazer por perto', 'Reservas'],
    primaryAction: 'Consultar disponibilidade pelo WhatsApp (ou pelo link de reserva, se houver)',
    schemaType: 'LodgingBusiness, Hotel ou BedAndBreakfast (o que for mais próximo da categoria)',
  },
  tecnologia: {
    mood: 'Moderno, rápido e confiável. Passa competência técnica e transparência no preço e no prazo.',
    palette: [
      'azul elétrico #2563EB (botão principal, com texto branco)',
      'branco #FFFFFF (fundo principal)',
      'grafite #111827 (texto)',
      'ciano #06B6D4 (detalhes)',
    ],
    typography: 'Títulos em Space Grotesk ou Sora (600–700); texto em Inter.',
    imagery: 'Fotos reais da bancada e de aparelhos consertados. Ícones de linha técnicos e consistentes.',
    sections: ['Serviços e aparelhos atendidos', 'Como funciona: diagnóstico, orçamento e prazo', 'Garantia ([confirmar com o cliente])'],
    primaryAction: 'Pedir orçamento pelo WhatsApp',
    schemaType: 'ElectronicsStore ou ComputerStore, ou LocalBusiness se for só assistência técnica',
  },
  geral: {
    mood: 'Próximo e direto, com cara de negócio do bairro bem cuidado. Confiança e praticidade acima de efeito visual.',
    palette: [
      'verde floresta #2D6A3E (botão principal, com texto branco)',
      'off-white #F7F7F5 (fundo principal)',
      'grafite #1C1B18 (texto)',
      'âmbar #D99A2B (destaques pontuais)',
    ],
    typography: 'Manrope ou Plus Jakarta Sans nos títulos (700); Inter no texto.',
    imagery: 'Fotos reais da fachada, do atendimento e do trabalho. Ícones de linha consistentes.',
    sections: ['Serviços principais em cards', 'Por que escolher (3 diferenciais tirados das avaliações)'],
    primaryAction: 'Falar no WhatsApp',
    schemaType: 'LocalBusiness ou o subtipo mais próximo da categoria',
  },
}

// Palavras sem acento e em minúsculas: a categoria é normalizada antes.
// A ordem importa: os nichos mais específicos vêm antes (clínica veterinária é pet, não saúde; autoescola é educação, não automotivo).
const STYLE_KEYWORDS: readonly (readonly [SiteStyle, RegExp])[] = [
  ['pet', /\bpet\b|pet ?shop|veterin|banho e tosa|agropet|aquario/],
  ['educacao', /escola|colegio|curso|idioma|ingles|creche|reforco|faculdade|universidade|treinamento/],
  ['fitness', /academia|crossfit|pilates|yoga|\bluta|jiu|muay|boxe|funcional|personal|natacao|danca|esporte/],
  [
    'automotivo',
    /mecanic|oficina|auto ?pecas|autocenter|funilaria|borracharia|lava ?jato|lava rapido|pneu|auto eletrica|retifica|despachante|automove|concessionaria|veiculo/,
  ],
  ['eventos', /buffet|festa|evento|fotograf|cerimonial|filmagem|casamento/],
  ['hospedagem', /hotel|pousada|hostel|motel|chale|resort|hospedagem/],
  ['imoveis', /imobiliari|\bimove(l|is)\b|corretor/],
  ['profissional', /advoca|advogad|juridic|contab|contador|consultoria|seguro|cartorio|escritorio/],
  ['tecnologia', /assistencia tecnica|celular|informatica|computador|eletronic|conserto|notebook|smartphone/],
  [
    'casa',
    /constru|reforma|eletricista|encanad|marcenar|vidrac|serralher|pintor|dedetiz|limpeza|jardin|\bmoveis|marmor|gesso|telhad|climatiz|ar condicionado/,
  ],
  ['beleza', /barb|salao|cabele|estetic|manicure|unha|sobrancelha|maquiag|\bspa\b|beleza|depila|tatu|cilios/],
  [
    'comida',
    /restaur|lanch|hamburg|pizz|padaria|confeit|cafe|\bbar\b|acai|sorvet|doce|marmit|churrasc|sushi|comida|food|pastel|espetinho|petisc/,
  ],
  ['saude', /dent|odonto|clinic|medic|fisio|psico|nutri|fono|pediatr|dermato|oftalm|farmac|laborat|saude|hospital/],
  ['moda', /roupa|moda|boutique|calcad|otica|joalher|acessori|bijuter|lingerie|loja/],
]

export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

/** Escolhe a direção de design pela categoria do Google. */
export function styleOf(category: string): SiteStyle {
  const normalized = normalizeText(category)
  return STYLE_KEYWORDS.find(([, pattern]) => pattern.test(normalized))?.[0] ?? 'geral'
}
