import { type FileRepository } from 'src/repository/FileRepository'
import { FileRepositoryImpl } from 'src/repository/FileRepositoryImpl'
import { Logger } from '../logger/Logger'

export const getFileRepository = (logger: Logger): FileRepository => {
  return new FileRepositoryImpl(logger)
}
