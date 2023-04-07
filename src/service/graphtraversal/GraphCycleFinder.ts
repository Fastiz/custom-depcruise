import { Node } from '../../model/graph/Node'

type NodeKey = string

export class GraphCycleFinder<NodeData> {
  readonly keyExtractor: (input: NodeData) => NodeKey
  readonly visitedNodes = new Set<string>()

  readonly result: Node<NodeData>[] | null

  constructor (root: Node<NodeData>, keyExtractor: (input: NodeData) => NodeKey) {
    this.keyExtractor = keyExtractor
    this.result = this.findCycle(root, [])
  }

  private findCycle = (current: Node<NodeData>, recStack: Node<NodeData>[]): Node<NodeData>[] | null => {
    const currentNodeKey = this.keyExtractor(current.getData())

    this.visitedNodes.add(currentNodeKey)
    const newRectStack = [...recStack, current]

    for (const dep of current.getChildren()) {
      const nodeKey = this.keyExtractor(dep.getData())

      if (this.visitedNodes.has(nodeKey)) {
        const visitedNodeInRecStackIndex = newRectStack
          .findIndex((value) => this.keyExtractor(value.getData()) === nodeKey)

        if (visitedNodeInRecStackIndex === -1) {
          continue
        }

        return newRectStack.slice(visitedNodeInRecStackIndex)
      }

      const foundCycleDown = this.findCycle(dep, newRectStack)
      if (foundCycleDown !== null) {
        return foundCycleDown
      }
    }

    return null
  }

  public get = (): Node<NodeData>[] | null => {
    return this.result
  }
}
