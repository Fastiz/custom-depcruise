import { Logger } from './Logger'

export class NoOperationLogger implements Logger {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  error = (): void => {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  info = (): void => {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  warn = (): void => {}
}
