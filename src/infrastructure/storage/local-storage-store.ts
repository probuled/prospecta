import type { Observable } from '@/application/ports/repositories'

/**
 * Valor persistido no localStorage com notificação de mudanças.
 * Mantém o snapshot em memória para devolver sempre a mesma referência entre renders.
 */
export class LocalStorageStore<T> implements Observable<T> {
  private readonly key: string
  private readonly listeners = new Set<() => void>()
  private value: T

  /** `legacyKey`: chave antiga (de quando o app se chamava Garimpo) cujos dados são migrados uma vez. */
  constructor(key: string, fallback: T, legacyKey?: string) {
    this.key = key
    if (legacyKey) migrateKey(legacyKey, key)
    this.value = this.read() ?? fallback
  }

  getSnapshot = (): T => this.value

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  set(value: T): void {
    this.value = value
    this.write(value)
    this.listeners.forEach((listener) => listener())
  }

  private read(): T | null {
    try {
      const raw = localStorage.getItem(this.key)
      return raw ? (JSON.parse(raw) as T) : null
    } catch {
      return null
    }
  }

  private write(value: T): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(value))
    } catch {
      // Sem armazenamento (aba anônima, cota cheia): segue só em memória.
    }
  }
}

function migrateKey(from: string, to: string): void {
  try {
    const legacy = localStorage.getItem(from)
    if (legacy === null) return
    if (localStorage.getItem(to) === null) localStorage.setItem(to, legacy)
    localStorage.removeItem(from)
  } catch {
    // Sem armazenamento: nada a migrar.
  }
}
