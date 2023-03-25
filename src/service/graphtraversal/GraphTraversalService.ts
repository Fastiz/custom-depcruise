import { DependencyTreeNode } from '../../model/DependencyTreeNode'
import { Observer } from '../../util/observer'

export interface GraphTraversalService {
  traverseGraph: (root: DependencyTreeNode, nodeObserver: Observer<DependencyTreeNode>) => void
}
