import { type DependencyTreeNode } from 'src/model/dependencyTreeNode/DependencyTreeNode'

export interface DependencyTreeService {
  buildDependencyTreeFromFilePath: (rootPath: string) => Promise<DependencyTreeNode>
}
