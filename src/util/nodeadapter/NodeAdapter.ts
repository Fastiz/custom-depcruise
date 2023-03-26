import { Node } from '../../model/graph/Node'

export class NodeAdapter<NodeLikeStructure, NodeData> implements Node<NodeData> {
  readonly nodeLikeStructure: NodeLikeStructure
  readonly nodeLikeStructureToChildrenMapper: (nodeLikeStructure: NodeLikeStructure) => NodeLikeStructure[]
  readonly nodeLikeStructureToDataMapper: (nodeLikeStructure: NodeLikeStructure) => NodeData

  constructor (
    nodeLikeStructure: NodeLikeStructure,
    nodeDataToChildrenMapper: (nodeLikeStructure: NodeLikeStructure) => NodeLikeStructure[],
    nodeDataToDataMapper: (nodeLikeStructure: NodeLikeStructure) => NodeData
  ) {
    this.nodeLikeStructure = nodeLikeStructure
    this.nodeLikeStructureToChildrenMapper = nodeDataToChildrenMapper
    this.nodeLikeStructureToDataMapper = nodeDataToDataMapper
  }

  getChildren = (): Node<NodeData>[] => {
    return this.nodeLikeStructureToChildrenMapper(this.nodeLikeStructure)
      .map(nodeLikeStructure => new NodeAdapter(
          nodeLikeStructure,
          this.nodeLikeStructureToChildrenMapper,
          this.nodeLikeStructureToDataMapper
        )
      )
  }

  getData = (): NodeData => {
    return this.nodeLikeStructureToDataMapper(this.nodeLikeStructure)
  }
}
