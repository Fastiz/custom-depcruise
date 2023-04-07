import { type DependencyTreeNode } from 'src/model/dependencyTreeNode/DependencyTreeNode'
import { type SourceFile } from 'src/model/File'
import { type FileRepository } from 'src/repository/FileRepository'
import { type DependencyTreeService } from 'src/service/dependencytree/DependencyTreeService'
import { notUndefined } from '../../util/notUndefined'
import { ImportDependency } from '../../model/ImportDependency'
import path from 'path'
import { NodeAsync } from '../../model/graph/NodeAsync'
import { NodeAsyncAdapter } from '../../model/graph/NodeAsyncAdapter'

export class DependencyTreeServiceImpl implements DependencyTreeService {
  readonly rootDirectory: string
  readonly fileRepository: FileRepository

  constructor (rootDirectory: string, fileRepository: FileRepository) {
    this.rootDirectory = rootDirectory
    this.fileRepository = fileRepository
  }

  buildDependencyTreeFromFilePathV2 = (rootPath: string): NodeAsync<SourceFile> => {
    const pathFromRoot = this.resolveRelativePathFromRoot(this.rootDirectory, rootPath)
    const sourceFile: SourceFile = { path: pathFromRoot }
    return new NodeAsyncAdapter(
      sourceFile,
      sourceFile => this.getNodeChildren(sourceFile),
      sourceFile => Promise.resolve(sourceFile)
    )
  }

  private getNodeChildren = async (sourceFile: SourceFile): Promise<SourceFile[]> => {
    const currentDirectory = path.dirname(sourceFile.path)

    const imports = await this.fileRepository.readImportsFromSourceFile(sourceFile)

    return imports.map(({ to }) => {
      const pathFromRoot = this.resolveRelativePathFromRoot(currentDirectory, to.path)

      return { path: pathFromRoot }
    })
  }

  buildDependencyTreeFromFilePath = async (rootPath: string): Promise<DependencyTreeNode> => {
    const pathFromRoot = this.resolveRelativePathFromRoot(this.rootDirectory, rootPath)
    const sourceFile: SourceFile = { path: pathFromRoot }
    const cachedNodes = new Map<string, DependencyTreeNode>()
    return await this.buildDependencyTreeFromRootPathRec(sourceFile, cachedNodes)
  }

  buildDependencyTreeFromRootPathRec = async (sourceFile: SourceFile, cachedNodes: Map<string, DependencyTreeNode>): Promise<DependencyTreeNode> => {
    const imports = await this.fileRepository.readImportsFromSourceFile(sourceFile)

    const currentDirectory = path.dirname(sourceFile.path)

    const getDependencyNode = async ({ to }: ImportDependency) => {
      const pathFromRoot = this.resolveRelativePathFromRoot(currentDirectory, to.path)

      const cachedNode = cachedNodes.get(pathFromRoot)

      if (notUndefined(cachedNode)) {
        return cachedNode
      }

      const newNode = await this.buildDependencyTreeFromRootPathRec({ path: pathFromRoot }, cachedNodes)
      cachedNodes.set(pathFromRoot, newNode)

      return newNode
    }

    const dependencies = await Promise.all(imports.map(getDependencyNode))

    return {
      nodeFile: sourceFile,
      dependencies
    }
  }

  resolveRelativePathFromRoot = (from: string, to: string): string => {
    let absolutePath: string

    if (to.startsWith('.')) {
      absolutePath = path.resolve(from, to)
    } else {
      absolutePath = path.resolve(this.rootDirectory, to)
    }

    return path.relative(this.rootDirectory, absolutePath)
  }
}
