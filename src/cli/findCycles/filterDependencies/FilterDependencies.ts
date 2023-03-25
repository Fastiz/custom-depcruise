import { DependencyTreeNode } from '../../../model/DependencyTreeNode'

export interface FilterDependencies {
  filter: (nodes: DependencyTreeNode[]) => DependencyTreeNode[]
}
