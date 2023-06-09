import { getFileRepository } from 'src/repository/FileRepositoryProvider'
import { type DependencyTreeService } from 'src/service/dependencytree/DependencyTreeService'
import { DependencyTreeServiceImpl } from 'src/service/dependencytree/DependencyTreeServiceImpl'

export const getDependencyTreeService = (rootDirectory: string): DependencyTreeService => {
  const fileRepository = getFileRepository()
  return new DependencyTreeServiceImpl(rootDirectory, fileRepository)
}
