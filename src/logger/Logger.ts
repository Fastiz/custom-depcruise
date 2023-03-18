export interface Logger {
  info: (text: string) => void
  warn: (text: string) => void
  error: (text: string) => void
}
