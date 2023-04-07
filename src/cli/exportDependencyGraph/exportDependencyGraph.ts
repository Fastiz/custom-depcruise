import { getLogger } from '../../logger/LoggerProvider'
import { notUndefined } from '../../util/notUndefined'
import { getDependencyTreeService } from '../../service/dependencytree/DependencyTreeServiceProvider'
import { DependencyTreeNode } from '../../model/dependencyTreeNode/DependencyTreeNode'
import { getGraphTraversalService } from '../../service/graphtraversal/GraphTraversalServiceProvider'
import { getDotFileBuilder } from './dotFileBuilder/DotFileBuilderProvider'
import { NodeAdapter } from '../../model/graph/NodeAdapter'
import { Node } from 'src/model/graph/Node'

const extractNodeName = (node: DependencyTreeNode): string => {
  return node.nodeFile.path
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

  const readNode = (node: Node<DependencyTreeNode>): void => {
    const from = extractNodeName(node.getData())

    node.getChildren().forEach((dep) => {
      const to = extractNodeName(dep.getData())
      dotFileBuilder.addDependency(from, to)
    })
  }

  const treeNode = new NodeAdapter(
    tree,
    (node) => node.dependencies,
    (node) => node
  )

  graphTraversalService.traverseGraph(
    treeNode,
    { next: readNode },
    (node) => node.getData().nodeFile.path
  )

  console.log(dotFileBuilder.buildContentString())
}

const run = async (): Promise<void> => {
  const args = process.argv.slice(2)
  await exportDependencyGraphCli(args)
}

run()
