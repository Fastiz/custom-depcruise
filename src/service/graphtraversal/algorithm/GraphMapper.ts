import { Node } from '../../../model/graph/Node'
import { ReadonlyNode } from '../../../model/graph/ReadonlyNode'
import { MutableNode } from '../../../model/graph/MutableNode'

type NodeCreatedCallback<Input> = (node: Node<Input>) => void
type NodeKey = string

export class GraphMapper<Input, Output> {
  readonly visitedNodes = new Set<NodeKey>()
  readonly nodeCreationSubscription = new Map<NodeKey, NodeCreatedCallback<Output>[]>()

  readonly mapper: (input: Input) => Output
  readonly keyExtractor: (input: Input) => NodeKey

  readonly result: Node<Output>

  constructor (
    graph: Node<Input>,
    mapper: (input: Input) => Output,
    keyExtractor: (input: Input) => NodeKey
  ) {
    this.mapper = mapper
    this.keyExtractor = keyExtractor
    this.result = this.mapGraphRec(graph)
  }

  private mapGraphRec = (curr: Node<Input>): Node<Output> => {
    const data = curr.getData()
    const children = curr.getChildren()

    const key = this.keyExtractor(data)
    const mappedData = this.mapper(data)

    this.visitedNodes.add(key)

    if (children.length === 0) {
      const newNode = new ReadonlyNode(mappedData, [])
      this.publishNodeCreated(key, newNode)
      return newNode
    }

    const mappedNode = new MutableNode<Output>(mappedData, [])

    children.forEach(child => {
      const childData = child.getData()
      const childKey = this.keyExtractor(childData)

      if (this.visitedNodes.has(childKey)) {
        const nodeCreatedCallback = (node: Node<Output>) => {
          mappedNode.addChild(node)
        }

        this.subscribeToNodeCreated(childKey, nodeCreatedCallback)
      } else {
        const mappedChild = this.mapGraphRec(child)
        mappedNode.addChild(mappedChild)
      }
    })

    this.publishNodeCreated(key, mappedNode)
    return mappedNode
  }

  private publishNodeCreated = (nodeKey: NodeKey, node: Node<Output>) => {
    const callbacks = this.nodeCreationSubscription.get(nodeKey) ?? []
    callbacks.forEach(callback => callback(node))
  }

  private subscribeToNodeCreated = (nodeKey: NodeKey, callback: NodeCreatedCallback<Output>) => {
    const existingCallbacks = this.nodeCreationSubscription.get(nodeKey) ?? []
    this.nodeCreationSubscription.set(nodeKey, [...existingCallbacks, callback])
  }

  public get = (): Node<Output> => {
    return this.result
  }
}
