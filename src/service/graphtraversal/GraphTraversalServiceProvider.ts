import { GraphTraversalService } from './GraphTraversalService'
import { GraphTraversalServiceImpl } from './GraphTraversalServiceImpl'

export const getGraphTraversalService = (): GraphTraversalService => {
  return new GraphTraversalServiceImpl()
}
