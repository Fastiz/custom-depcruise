import { DependencyTreeNode } from '../../../model/dependencyTreeNode/DependencyTreeNode'

export interface FilterDependencies {
  filter: (nodes: DependencyTreeNode[]) => DependencyTreeNode[]
}
