import { type DependencyTreeService } from 'src/service/dependencytree/DependencyTreeService'
import { DependencyTreeServiceImpl } from 'src/service/dependencytree/DependencyTreeServiceImpl'
import { FileRepository } from '../../repository/FileRepository'

export const getDependencyTreeService = (rootDirectory: string, fileRepository: FileRepository): DependencyTreeService => {
  return new DependencyTreeServiceImpl(rootDirectory, fileRepository)
}
