import { GraphTraversalService } from './GraphTraversalService'
import { Observer } from '../../util/observer'
import { Node } from '../../model/graph/Node'
import { GraphMapper } from './GraphMapper'
import { NodeAsync } from '../../model/graph/NodeAsync'
import { GraphAsyncToGraphMapper } from './GraphAsyncToGraphMapper'
import { GraphTraverser } from './GraphTraverser'

export class GraphTraversalServiceImpl implements GraphTraversalService {
  traverseGraph = <NodeData> (
    root: Node<NodeData>,
    nodeObserver: Observer<Node<NodeData>>,
    keyExtractor: (data: NodeData) => string
  ): void => {
    const graphTraverser = new GraphTraverser(root, nodeObserver, keyExtractor)
    graphTraverser.traverseGraph()
  }

  findCycle = <NodeData> (root: Node<NodeData>, keyExtractor: (input: NodeData) => string): Node<NodeData>[] | null => {
    const visitedNodes = new Set<string>()
    const recStack: Node<NodeData>[] = []
    return this.findCycleRec(root, visitedNodes, recStack, keyExtractor)
  }

  findCycleRec = <NodeData> (current: Node<NodeData>, visitedNodes: Set<string>, recStack: Node<NodeData>[], keyExtractor: (input: NodeData) => string): Node<NodeData>[] | null => {
    const currentNodeKey = keyExtractor(current.getData())

    visitedNodes.add(currentNodeKey)
    const newRectStack = [...recStack, current]

    for (const dep of current.getChildren()) {
      const nodeKey = keyExtractor(dep.getData())

      if (visitedNodes.has(nodeKey)) {
        const visitedNodeInRecStackIndex = newRectStack
          .findIndex((value) => keyExtractor(value.getData()) === nodeKey)

        if (visitedNodeInRecStackIndex === -1) {
          continue
        }

        return newRectStack.slice(visitedNodeInRecStackIndex)
      }

      const foundCycleDown = this.findCycleRec(dep, visitedNodes, newRectStack, keyExtractor)
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

  mapGraphAsyncToGraph = async <NodeData> (
    graph: NodeAsync<NodeData>,
    keyExtractor: (input: NodeData) => string
  ): Promise<Node<NodeData>> => {
    const graphAsyncToGraphMapper = new GraphAsyncToGraphMapper(graph, keyExtractor)
    return await graphAsyncToGraphMapper.get()
  }
}
