import { type Logger } from 'src/logger/Logger'
import { NoOperationLogger } from './NoOperationLogger'

export const getLogger = (): Logger => {
  return new NoOperationLogger()
}
