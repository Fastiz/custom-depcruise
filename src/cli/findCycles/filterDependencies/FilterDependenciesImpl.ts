import { FilterDependencies } from './FilterDependencies'
import { DependencyTreeNode } from '../../../model/dependencyTreeNode/DependencyTreeNode'

export class FilterDependenciesImpl implements FilterDependencies {
  filter = (nodes: DependencyTreeNode[]): DependencyTreeNode[] => {
    const allNodeKeys = new Set<string>(nodes.map(node => this.extractKey(node)))

    return nodes.map(node => this.filterNode(node, allNodeKeys))
  }

  filterNode = (node: DependencyTreeNode, allNodeKeys: Set<string>): DependencyTreeNode => {
    const newDependencies = node.dependencies.filter(dep => allNodeKeys.has(this.extractKey(dep)))

    return {
      nodeFile: node.nodeFile,
      dependencies: newDependencies
    }
  }

  extractKey = (node: DependencyTreeNode): string => {
    return node.nodeFile.path
  }
}
