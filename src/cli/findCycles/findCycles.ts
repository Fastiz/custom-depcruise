import { getLogger } from '../../logger/LoggerProvider'
import { notUndefined } from '../../util/notUndefined'
import { getDependencyTreeService } from '../../service/dependencytree/DependencyTreeServiceProvider'
import { getGraphTraversalService } from '../../service/graphtraversal/GraphTraversalServiceProvider'
import { getFilterDependencies } from './filterDependencies/FilterDependenciesProvider'
import { getDotFileBuilder } from '../exportDependencyGraph/dotFileBuilder/DotFileBuilderProvider'
import { SourceFile } from '../../model/File'
import { Node } from 'src/model/graph/Node'

const keyExtractor = (sourceFile: SourceFile) => {
  return sourceFile.path
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

  const dependencyGraphAsync = dependencyTreeService.buildDependencyTreeFromFilePath(rootFile)
  const dependencyGraph = await graphTraversalService.mapGraphAsyncToGraph(
    dependencyGraphAsync,
    sourceFile => sourceFile.path
  )

  const cycle = graphTraversalService.findCycle(dependencyGraph, keyExtractor)

  if (cycle === null) {
    console.log('There are no cycles')
    return
  }

  const filteredCycle = filterDependencies.filter(cycle, keyExtractor)

  const [first] = filteredCycle

  if (first === undefined) {
    throw Error('Invalid state exception')
  }

  const readNode = (node: Node<SourceFile>): void => {
    const from = keyExtractor(node.getData())

    node.getChildren().forEach((dep) => {
      const to = keyExtractor(dep.getData())
      dotFileBuilder.addDependency(from, to)
    })
  }

  graphTraversalService.traverseGraph(
    first,
    { next: readNode },
    keyExtractor
  )

  console.log(dotFileBuilder.buildContentString())
}

const run = async (): Promise<void> => {
  const args = process.argv.slice(2)
  await findCycles(args)
}

run()
