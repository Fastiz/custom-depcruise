import { type DependencyTreeNode } from 'src/model/dependencyTreeNode/DependencyTreeNode'
import { SourceFile } from '../../model/File'
import { NodeAsync } from '../../model/graph/NodeAsync'

export interface DependencyTreeService {
  buildDependencyTreeFromFilePath: (rootPath: string) => Promise<DependencyTreeNode>
  buildDependencyTreeFromFilePathV2: (rootPath: string) => NodeAsync<SourceFile>
}
