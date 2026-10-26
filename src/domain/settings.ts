import { DEFAULT_MESSAGE_TEMPLATE } from './message-template'

export interface Settings {
  readonly messageTemplate: string
}

export const DEFAULT_SETTINGS: Settings = {
  messageTemplate: DEFAULT_MESSAGE_TEMPLATE,
}
