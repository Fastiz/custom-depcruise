import { Observer } from '../../util/observer'
import { Node } from 'src/model/graph/Node'
import { NodeAsync } from '../../model/graph/NodeAsync'

export interface GraphTraversalService {
  traverseGraph: <NodeData>(
    root: Node<NodeData>,
    nodeObserver: Observer<Node<NodeData>>,
    keyExtractor: (data: NodeData) => string) => void

  mapGraph: <Input, Output>(
    graph: Node<Input>,
    mapper: (input: Input) => Output,
    keyExtractor: (input: Input) => string
  ) => Node<Output>

  mapGraphAsyncToGraph: <NodeData>(
    graph: NodeAsync<NodeData>,
    keyExtractor: (input: NodeData) => string
  ) => Promise<Node<NodeData>>

  findCycle: <NodeData>(root: Node<NodeData>, keyExtractor: (input: NodeData) => string) => Node<NodeData>[] | null
}
