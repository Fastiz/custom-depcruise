import { getLogger } from '../../logger/LoggerProvider'
import { notUndefined } from '../../util/notUndefined'
import { getDependencyTreeService } from '../../service/dependencytree/DependencyTreeServiceProvider'
import { DependencyTreeNode } from '../../model/DependencyTreeNode'
import { getGraphTraversalService } from '../../service/graphtraversal/GraphTraversalServiceProvider'
import { getDotFileBuilder } from './dotFileBuilder/DotFileBuilderProvider'

const extractNodeName = (node: DependencyTreeNode): string => {
  const path = node.nodeFile.path
  const lastIndexOfSlash = path.lastIndexOf('/')

  if(lastIndexOfSlash === -1){
    return path
  }

  return path.slice(lastIndexOfSlash + 1)
}

export const exportDependencyGraphCli = async (args: string[]) => {
  const logger = getLogger()

  const [rootFile] = args

  if (!notUndefined(rootFile)) {
    logger.error(`Invalid arguments: ${args}`)
    return
  }

  const rootDirectory = process.cwd()

  const dependencyTreeService = getDependencyTreeService(rootDirectory)
  const graphTraversalService = getGraphTraversalService()
  const dotFileBuilder = getDotFileBuilder()

  const tree = await dependencyTreeService.buildDependencyTreeFromFilePath(rootFile)

  const readNode = (node: DependencyTreeNode): void => {
    const from = extractNodeName(node)

    node.dependencies.forEach((dep) => {
      const to = extractNodeName(dep)
      dotFileBuilder.addDependency(from, to)
    })
  }

  graphTraversalService.traverseGraph(tree, { next: readNode })

  console.log(dotFileBuilder.buildContentString())
}
