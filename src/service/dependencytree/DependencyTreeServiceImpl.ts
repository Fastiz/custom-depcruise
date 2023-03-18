import { type DependencyTreeNode } from 'src/model/DependencyTreeNode'
import { type SourceFile } from 'src/model/File'
import { type FileRepository } from 'src/repository/FileRepository'
import { type DependencyTreeService } from 'src/service/dependencytree/DependencyTreeService'
import { notUndefined } from '../../util/notUndefined'
import { ImportDependency } from '../../model/ImportDependency'
import path from 'path'

export class DependencyTreeServiceImpl implements DependencyTreeService {
  readonly workingDirectory: string
  readonly fileRepository: FileRepository

  constructor (workingDirectory: string, fileRepository: FileRepository) {
    this.workingDirectory = workingDirectory
    this.fileRepository = fileRepository
  }

  buildDependencyTreeFromFilePath = async (rootPath: string): Promise<DependencyTreeNode> => {
    const absolutePath = this.resolvePath(this.workingDirectory, rootPath)
    const sourceFile: SourceFile = { path: absolutePath }
    const cachedNodes = new Map<string, DependencyTreeNode>()
    return await this.buildDependencyTreeFromRootPathRec(sourceFile, cachedNodes)
  }

  buildDependencyTreeFromRootPathRec = async (sourceFile: SourceFile, cachedNodes: Map<string, DependencyTreeNode>): Promise<DependencyTreeNode> => {
    const imports = await this.fileRepository.readImportsFromSourceFile(sourceFile)

    const currentDirectory = path.dirname(sourceFile.path)

    const getDependencyNode = async ({ to }: ImportDependency) => {
      const fullPath = this.resolvePath(currentDirectory, to.path)

      const cachedNode = cachedNodes.get(fullPath)

      if (notUndefined(cachedNode)) {
        return cachedNode
      }

      const newNode = await this.buildDependencyTreeFromRootPathRec({ path: fullPath }, cachedNodes)
      cachedNodes.set(fullPath, newNode)

      return newNode
    }

    const dependencies = await Promise.all(imports.map(getDependencyNode))

    return {
      nodeFile: sourceFile,
      dependencies
    }
  }

  resolvePath = (from: string, to: string): string => {
    if (to.startsWith('.')) {
      return path.resolve(from, to)
    }

    return path.resolve(this.workingDirectory, to)
  }
}
