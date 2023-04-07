import { GraphTraversalService } from './GraphTraversalService'
import { DependencyTreeNode } from '../../model/dependencyTreeNode/DependencyTreeNode'
import { Observer } from '../../util/observer'
import { Node } from '../../model/graph/Node'
import { GraphMapper } from './GraphMapper'

export class GraphTraversalServiceImpl implements GraphTraversalService {
  traverseGraph = <NodeData> (
    root: Node<NodeData>,
    nodeObserver: Observer<Node<NodeData>>,
    nodeKeyExtractor: (node: Node<NodeData>) => string
  ): void => {
    const visitedNodes = new Set<string>()
    this.traverseGraphRec(root, nodeObserver, visitedNodes, nodeKeyExtractor)
  }

  traverseGraphRec = <NodeData> (
    current: Node<NodeData>,
    nodeObserver: Observer<Node<NodeData>>,
    visitedNodes: Set<string>,
    nodeKeyExtractor: (node: Node<NodeData>) => string
  ) => {
    visitedNodes.add(nodeKeyExtractor(current))
    nodeObserver.next(current)

    current.getChildren().forEach((dep) => {
      const nodeKey = nodeKeyExtractor(dep)
      if (visitedNodes.has(nodeKey)) {
        return
      }

      this.traverseGraphRec(dep, nodeObserver, visitedNodes, nodeKeyExtractor)
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

  mapGraph = <Input, Output> (
    graph: Node<Input>,
    mapper: (input: Input) => Output,
    keyExtractor: (input: Input) => string
  ): Node<Output> => {
    const graphMapper = new GraphMapper(graph, mapper, keyExtractor)
    return graphMapper.get()
  }

  extractKeyFromNode = (node: DependencyTreeNode): string => {
    return node.nodeFile.path
  }
}
