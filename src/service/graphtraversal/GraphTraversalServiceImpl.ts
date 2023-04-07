import { GraphTraversalService } from './GraphTraversalService'
import { Observer } from '../../util/observer'
import { Node } from '../../model/graph/Node'
import { GraphMapper } from './algorithm/GraphMapper'
import { NodeAsync } from '../../model/graph/NodeAsync'
import { GraphAsyncToGraphMapper } from './algorithm/GraphAsyncToGraphMapper'
import { GraphTraverser } from './algorithm/GraphTraverser'
import { GraphCycleFinder } from './algorithm/GraphCycleFinder'

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
    return new GraphCycleFinder(root, keyExtractor).get()
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
