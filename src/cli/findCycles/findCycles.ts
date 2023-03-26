import { getLogger } from '../../logger/LoggerProvider'
import { notUndefined } from '../../util/notUndefined'
import { getDependencyTreeService } from '../../service/dependencytree/DependencyTreeServiceProvider'
import { getGraphTraversalService } from '../../service/graphtraversal/GraphTraversalServiceProvider'
import { getFilterDependencies } from './filterDependencies/FilterDependenciesProvider'
import { getDotFileBuilder } from '../exportDependencyGraph/dotFileBuilder/DotFileBuilderProvider'
import { DependencyTreeNode } from '../../model/dependencyTreeNode/DependencyTreeNode'

const extractNodeName = (node: DependencyTreeNode): string => {
  return node.nodeFile.path
}

const findCycles = async (args: string[]): Promise<void> => {
  const logger = getLogger()

  const [rootFile] = args

  if (!notUndefined(rootFile)) {
    logger.error(`Invalid arguments: ${args}`)
    return
  }

  const rootDirectory = process.cwd()

  const dependencyTreeService = getDependencyTreeService(rootDirectory)
  const graphTraversalService = getGraphTraversalService()
  const filterDependencies = getFilterDependencies()
  const dotFileBuilder = getDotFileBuilder()

  const dependencyGraph = await dependencyTreeService.buildDependencyTreeFromFilePath(rootFile)
  const cycle = graphTraversalService.findCycle(dependencyGraph)

  if (cycle === null) {
    return
  }

  const filteredCycle = filterDependencies.filter(cycle)

  const [first] = filteredCycle

  if (first === undefined) {
    throw Error('Invalid state exception')
  }

  const readNode = (node: DependencyTreeNode): void => {
    const from = extractNodeName(node)

    node.dependencies.forEach((dep) => {
      const to = extractNodeName(dep)
      dotFileBuilder.addDependency(from, to)
    })
  }

  graphTraversalService.traverseGraph(first, { next: readNode })

  console.log(dotFileBuilder.buildContentString())
}

const run = async (): Promise<void> => {
  const args = process.argv.slice(2)
  await findCycles(args)
}

run()
