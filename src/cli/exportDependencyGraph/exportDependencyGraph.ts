import { getLogger } from '../../logger/LoggerProvider'
import { notUndefined } from '../../util/notUndefined'
import { getDependencyTreeService } from '../../service/dependencytree/DependencyTreeServiceProvider'
import { getGraphTraversalService } from '../../service/graphtraversal/GraphTraversalServiceProvider'
import { getDotFileBuilder } from './dotFileBuilder/DotFileBuilderProvider'
import { Node } from 'src/model/graph/Node'
import { SourceFile } from '../../model/File'

const extractNodeName = (node: Node<SourceFile>): string => {
  return node.getData().path
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

  const graphAsync = dependencyTreeService.buildDependencyTreeFromFilePathV2(rootFile)
  const graph = await graphTraversalService.mapGraphAsyncToGraph(graphAsync, node => node.path)

  const readNode = (node: Node<SourceFile>): void => {
    const from = extractNodeName(node)

    node.getChildren().forEach((dep) => {
      const to = extractNodeName(dep)
      dotFileBuilder.addDependency(from, to)
    })
  }

  graphTraversalService.traverseGraph(
    graph,
    { next: readNode },
    node => extractNodeName(node)
  )

  console.log(dotFileBuilder.buildContentString())
}

const run = async (): Promise<void> => {
  const args = process.argv.slice(2)
  await exportDependencyGraphCli(args)
}

run()
