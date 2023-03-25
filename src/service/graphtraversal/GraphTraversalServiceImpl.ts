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
      if (visitedNodes.has(nodeKey)) {
        return
      }

      this.traverseGraphRec(dep, nodeObserver, visitedNodes)
    })
  }

  findCycle = (root: DependencyTreeNode): DependencyTreeNode[] | null => {
    const visitedNodes = new Set<string>()
    const recStack: DependencyTreeNode[] = []
    return this.findCycleRec(root, visitedNodes, recStack)
  }

  findCycleRec = (current: DependencyTreeNode, visitedNodes: Set<string>, recStack: DependencyTreeNode[]): DependencyTreeNode[] | null => {
    const currentNodeKey = this.extractKeyFromNode(current)

    visitedNodes.add(currentNodeKey)
    const newRectStack = [...recStack, current]

    for (const dep of current.dependencies) {
      const nodeKey = this.extractKeyFromNode(dep)

      if (visitedNodes.has(nodeKey)) {
        const visitedNodeInRecStackIndex = newRectStack
          .findIndex((value) => this.extractKeyFromNode(value) === nodeKey)

        if (visitedNodeInRecStackIndex === -1) {
          continue
        }

        return newRectStack.slice(visitedNodeInRecStackIndex)
      }

      const foundCycleDown = this.findCycleRec(dep, visitedNodes, newRectStack)
      if (foundCycleDown !== null) {
        return foundCycleDown
      }
    }

    return null
  }

  extractKeyFromNode = (node: DependencyTreeNode): string => {
    return node.nodeFile.path
  }
}
