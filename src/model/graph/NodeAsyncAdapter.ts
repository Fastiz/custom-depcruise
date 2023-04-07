import { NodeAsync } from './NodeAsync'

export class NodeAsyncAdapter<NodeLikeStructure, NodeData> implements NodeAsync<NodeData> {
  readonly nodeLikeStructure: NodeLikeStructure
  readonly nodeLikeStructureToChildrenMapper: (nodeLikeStructure: NodeLikeStructure) => Promise<NodeLikeStructure[]>
  readonly nodeLikeStructureToDataMapper: (nodeLikeStructure: NodeLikeStructure) => Promise<NodeData>

  constructor (
    nodeLikeStructure: NodeLikeStructure,
    nodeDataToChildrenMapper: (nodeLikeStructure: NodeLikeStructure) => Promise<NodeLikeStructure[]>,
    nodeDataToDataMapper: (nodeLikeStructure: NodeLikeStructure) => Promise<NodeData>
  ) {
    this.nodeLikeStructure = nodeLikeStructure
    this.nodeLikeStructureToChildrenMapper = nodeDataToChildrenMapper
    this.nodeLikeStructureToDataMapper = nodeDataToDataMapper
  }

  getChildren = async (): Promise<NodeAsync<NodeData>[]> => {
    const children = await this.nodeLikeStructureToChildrenMapper(this.nodeLikeStructure)

    return children.map(nodeLikeStructure => new NodeAsyncAdapter(
        nodeLikeStructure,
        this.nodeLikeStructureToChildrenMapper,
        this.nodeLikeStructureToDataMapper
      )
    )
  }

  getData = async (): Promise<NodeData> => {
    return await this.nodeLikeStructureToDataMapper(this.nodeLikeStructure)
  }
}
