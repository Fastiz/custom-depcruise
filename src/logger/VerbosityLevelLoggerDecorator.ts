import { Logger } from './Logger'

export enum VerbosityLevel {
  ERROR, WARNING, INFO, NONE
}

export class VerbosityLevelLoggerDecorator implements Logger {
  verbosityLevel: VerbosityLevel
  readonly logger: Logger

  constructor (verbosityLevel: VerbosityLevel, logger: Logger) {
    this.verbosityLevel = verbosityLevel
    this.logger = logger
  }

  error = (text: string): void => {
    if (
      this.verbosityLevel !== VerbosityLevel.ERROR &&
      this.verbosityLevel !== VerbosityLevel.WARNING &&
      this.verbosityLevel !== VerbosityLevel.INFO
    ) {
      return
    }

    this.logger.error(text)
  }

  warn = (text: string): void => {
    if (
      this.verbosityLevel !== VerbosityLevel.WARNING &&
      this.verbosityLevel !== VerbosityLevel.INFO
    ) {
      return
    }

    this.logger.warn(text)
  }

  info = (text: string): void => {
    if (
      this.verbosityLevel !== VerbosityLevel.INFO
    ) {
      return
    }

    this.logger.info(text)
  }

  setVerbosityLevel = (verbosityLevel: VerbosityLevel) => {
    this.verbosityLevel = verbosityLevel
  }
}
