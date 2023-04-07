import { type Logger } from 'src/logger/Logger'
import { LoggerImpl } from './LoggerImpl'
import { VerbosityLevel, VerbosityLevelLoggerDecorator } from './VerbosityLevelLoggerDecorator'

const logger = new LoggerImpl()
const verbosityLevelLoggerDecorator = new VerbosityLevelLoggerDecorator(VerbosityLevel.ERROR, logger)

export const getLogger = (): Logger => {
  return verbosityLevelLoggerDecorator
}

export const setLoggerVerbosityLevel = (verbosityLevel: VerbosityLevel) => {
  verbosityLevelLoggerDecorator.setVerbosityLevel(verbosityLevel)
}
