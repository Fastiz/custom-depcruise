import { Node } from '../../../model/graph/Node'
import { Observer } from '../../../util/observer'

type NodeKey = string

export class GraphTraverser<NodeData> {
  readonly root: Node<NodeData>
  readonly nodeObserver: Observer<Node<NodeData>>
  readonly keyExtractor: (input: NodeData) => NodeKey

  visitedNodes = new Set<string>()

  constructor (
    root: Node<NodeData>,
    nodeObserver: Observer<Node<NodeData>>,
    nodeKeyExtractor: (input: NodeData) => NodeKey,
  ) {
    this.root = root
    this.nodeObserver = nodeObserver
    this.keyExtractor = nodeKeyExtractor
  }

  public traverseGraph = (): void => {
    this.visitedNodes = new Set<string>()
    this.traverseGraphRec(this.root)
  }

  private traverseGraphRec = (current: Node<NodeData>) => {
    const currentKey = this.keyExtractor(current.getData())

    this.visitedNodes.add(currentKey)
    this.nodeObserver.next(current)

    current.getChildren().forEach((dep) => {
      const nodeKey = this.keyExtractor(dep.getData())
      if (this.visitedNodes.has(nodeKey)) {
        return
      }

      this.traverseGraphRec(dep)
    })
  }
}
