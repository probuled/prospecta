/** Uma avaliação escrita do Google Maps. */
export interface Review {
  readonly author: string
  /** Estrelas, de 1 a 5. */
  readonly rating: number
  readonly text: string
  /** Quando foi publicada, como o Google mostra ("há 2 meses"). */
  readonly when: string
}

export interface ProfileImage {
  readonly title: string
  readonly url: string
}

/**
 * O perfil do negócio no Google Maps além do básico (nome, telefone, nota).
 * É a matéria-prima do diagnóstico de presença digital e da prévia do site.
 */
export interface BusinessProfile {
  readonly description: string
  readonly neighborhood: string
  /** Situação no Google, quando não está funcionando normalmente (ex.: "Fechado permanentemente"). */
  readonly businessStatus: string
  readonly priceRange: string
  readonly thumbnailUrl: string
  readonly images: readonly ProfileImage[]
  /** Horários por dia da semana, como o Google mostra (ex.: `{ "segunda-feira": ["08:00–18:00"] }`). */
  readonly openingHours: Readonly<Record<string, readonly string[]>>
  /** Quantidade de avaliações por estrela: posição 0 = 1 estrela, posição 4 = 5 estrelas. */
  readonly reviewsPerRating: readonly number[]
  readonly reviews: readonly Review[]
  /**
   * O dono tem conta identificada no Google (`owner.id`). Indício de perfil reivindicado, ainda não confirmado.
   * O nome do dono não serve: o Google preenche "<negócio> (proprietário)" em todos.
   */
  readonly hasOwner: boolean
  readonly menuUrl: string
  readonly orderOnlineUrls: readonly string[]
  readonly reservationUrls: readonly string[]
}
