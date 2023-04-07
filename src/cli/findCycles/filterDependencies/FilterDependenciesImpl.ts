import { FilterDependencies } from './FilterDependencies'
import { Node } from 'src/model/graph/Node'
import { ReadonlyNode } from '../../../model/graph/ReadonlyNode'
import { notNull } from '../../../util/notNull'
import { MutableNode } from '../../../model/graph/MutableNode'

export class FilterDependenciesImpl implements FilterDependencies {
  filter = <DataValue> (
    nodes: Node<DataValue>[],
    keyExtractor: (input: DataValue) => string
  ): Node<DataValue>[] => {
    const keysInTheCycle = new Set<string>(
      nodes.map(node => keyExtractor(node.getData()))
    )

    const nodesWithoutUnrelatedDependencies = nodes
      .map(node => this.removeUnrelatedChildren(node, keysInTheCycle, keyExtractor))
      .map(node => new MutableNode(node.getData(), node.getChildren()))

    const nodesInTheCycleByKey = new Map<string, Node<DataValue>>(
      nodesWithoutUnrelatedDependencies.map(node => [keyExtractor(node.getData()), node])
    )

    nodesWithoutUnrelatedDependencies.forEach(node => this.linkNewNodesTogether(node, nodesInTheCycleByKey, keyExtractor))

    return nodesWithoutUnrelatedDependencies
  }

  removeUnrelatedChildren = <DataValue> (
    node: Node<DataValue>,
    keysInTheCycle: Set<string>,
    keyExtractor: (input: DataValue) => string
  ): Node<DataValue> => {
    const newDependencies = node.getChildren()
      .filter(dep => {
        const depKey = keyExtractor(dep.getData())
        return keysInTheCycle.has(depKey)
      })

    return new ReadonlyNode(node.getData(), newDependencies)
  }

  linkNewNodesTogether = <DataValue> (
    node: MutableNode<DataValue>,
    nodesInTheCycleByKey: Map<string, Node<DataValue>>,
    keyExtractor: (input: DataValue) => string
  ) => {
    const newChildren = node.getChildren()
      .map(dep => {
        const depKey = keyExtractor(dep.getData())
        const newDep = nodesInTheCycleByKey.get(depKey)
        return newDep ?? null
      })
      .filter(notNull)

    node.setChildren(newChildren)
  }
}
