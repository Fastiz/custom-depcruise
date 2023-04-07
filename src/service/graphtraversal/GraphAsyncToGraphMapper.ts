import { NodeAsync } from '../../model/graph/NodeAsync'
import { ReadonlyNode } from '../../model/graph/ReadonlyNode'
import { MutableNode } from '../../model/graph/MutableNode'
import { Node } from '../../model/graph/Node'

type NodeCreatedCallback<Input> = (node: Node<Input>) => void
type NodeKey = string

export class GraphAsyncToGraphMapper<NodeData> {
  readonly visitedNodes = new Set<NodeKey>()
  readonly nodeCreationSubscription = new Map<NodeKey, NodeCreatedCallback<NodeData>[]>()

  readonly graph: NodeAsync<NodeData>
  readonly keyExtractor: (input: NodeData) => NodeKey

  result: Node<NodeData> | null = null

  constructor (
    graph: NodeAsync<NodeData>,
    keyExtractor: (input: NodeData) => NodeKey
  ) {
    this.graph = graph
    this.keyExtractor = keyExtractor
  }

  public get = async (): Promise<Node<NodeData>> => {
    if (this.result !== null) {
      return this.result
    }

    this.result = await this.mapGraphRec(this.graph)
    return this.result
  }

  private mapGraphRec = async (curr: NodeAsync<NodeData>): Promise<Node<NodeData>> => {
    const data = await curr.getData()
    const children = await curr.getChildren()

    const key = this.keyExtractor(data)

    this.visitedNodes.add(key)

    if (children.length === 0) {
      const newNode = new ReadonlyNode(data, [])
      this.publishNodeCreated(key, newNode)
      return newNode
    }

    const mappedNode = new MutableNode<NodeData>(data, [])

    const promises = children.map(async child => {
      const childData = await child.getData()
      const childKey = this.keyExtractor(childData)

      if (this.visitedNodes.has(childKey)) {
        const nodeCreatedCallback = (node: Node<NodeData>) => {
          mappedNode.addChild(node)
        }

        this.subscribeToNodeCreated(childKey, nodeCreatedCallback)
      } else {
        const mappedChild = await this.mapGraphRec(child)
        mappedNode.addChild(mappedChild)
      }
    })

    await Promise.all(promises)

    this.publishNodeCreated(key, mappedNode)
    return mappedNode
  }

  private publishNodeCreated = (nodeKey: NodeKey, node: Node<NodeData>) => {
    const callbacks = this.nodeCreationSubscription.get(nodeKey) ?? []
    callbacks.forEach(callback => callback(node))
  }

  private subscribeToNodeCreated = (nodeKey: NodeKey, callback: NodeCreatedCallback<NodeData>) => {
    const existingCallbacks = this.nodeCreationSubscription.get(nodeKey) ?? []
    this.nodeCreationSubscription.set(nodeKey, [...existingCallbacks, callback])
  }
}
