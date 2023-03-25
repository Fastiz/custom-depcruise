import { GraphTraversalService } from './GraphTraversalService'
import { DependencyTreeNode } from '../../model/DependencyTreeNode'
import { Observer } from '../../util/observer'

export class GraphTraversalServiceImpl implements GraphTraversalService {
  traverseGraph = (root: DependencyTreeNode, nodeObserver: Observer<DependencyTreeNode>): void => {
    const visitedNodes = new Set<string>()
    this.traverseGraphRec(root, nodeObserver, visitedNodes)
  }

  traverseGraphRec = (current: DependencyTreeNode, nodeObserver: Observer<DependencyTreeNode>, visitedNodes: Set<string>) => {
    visitedNodes.add(this.extractKeyFromNode(current))
    nodeObserver.next(current)

    current.dependencies.forEach((dep) => {
      const nodeKey = this.extractKeyFromNode(dep)
      if(visitedNodes.has(nodeKey)){
        return
      }

      this.traverseGraphRec(dep, nodeObserver, visitedNodes)
    })
  }

  extractKeyFromNode = (node: DependencyTreeNode): string => {
    return node.nodeFile.path
  }
}
