import { Node } from '../../../model/graph/Node'

export interface FilterDependencies {
  filter: <DataValue> (
    nodes: Node<DataValue>[],
    keyExtractor: (input: DataValue) => string
  ) => Node<DataValue>[]
}
