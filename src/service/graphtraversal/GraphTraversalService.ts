import { DependencyTreeNode } from '../../model/dependencyTreeNode/DependencyTreeNode'
import { Observer } from '../../util/observer'
import { Node } from 'src/model/graph/Node'

export interface GraphTraversalService {
  traverseGraph: <NodeData>(
    root: Node<NodeData>,
    nodeObserver: Observer<Node<NodeData>>,
    nodeKeyExtractor: (node: Node<NodeData>
    ) => string) => void

  mapGraph: <Input, Output>(
    graph: Node<Input>,
    mapper: (input: Input) => Output,
    keyExtractor: (input: Input) => string
  ) => Node<Output>

  findCycle: (root: DependencyTreeNode) => DependencyTreeNode[] | null
}
