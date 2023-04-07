import { getLogger } from 'src/logger/LoggerProvider'
import { getDependencyTreeService } from 'src/service/dependencytree/DependencyTreeServiceProvider'
import { getRuleViolationService } from 'src/service/ruleviolation/RuleViolationServiceProvider'
import { notUndefined } from 'src/util/notUndefined'
import { ForbiddenDependencyRule } from 'src/model/ForbiddenDependencyRule'
import { getFileRepository } from '../../repository/FileRepositoryProvider'
import { notNull } from '../../util/notNull'
import { parseRules } from './mapper/ruleFileParser'
import { getGraphTraversalService } from '../../service/graphtraversal/GraphTraversalServiceProvider'

type Params = {
  rootFile: string
  rules: ForbiddenDependencyRule[]
}

const violationsFromRuleFile = async (params: Params) => {
  const {
    rootFile,
    rules
  } = params

  const rootDirectory = process.cwd()

  const dependencyTreeService = getDependencyTreeService(rootDirectory)
  const ruleViolationService = getRuleViolationService()
  const graphTraversalService = getGraphTraversalService()

  const graphAsync = dependencyTreeService.buildDependencyTreeFromFilePathV2(rootFile)
  const graph = await graphTraversalService.mapGraphAsyncToGraph(graphAsync, node => node.path)

  const violations = ruleViolationService.findViolationsV2(graph, rules)

  violations.forEach(violation => {
    console.log(violation)
  })
}

const readRulesFromFile = async (rulesFilePath: string): Promise<ForbiddenDependencyRule[]> => {
  const logger = getLogger()
  const fileRepository = getFileRepository()

  const allLines: string[] = []

  const lineReader = (line: string) => {
    allLines.push(line)
  }

  try {
    await fileRepository.readLinesFromFile(rulesFilePath, { next: lineReader })
  } catch (e) {
    logger.error('Could not read the rules file')
    throw e
  }

  const readRules: unknown = JSON.parse(allLines.join(''))

  const parsedRules = parseRules(readRules)

  if (parsedRules == null) {
    const errorMessage = 'Could not parse the rules file'
    logger.error(errorMessage)
    throw Error(errorMessage)
  }

  return parsedRules
    .filter((rule): rule is ForbiddenDependencyRule => {
      if (notNull(rule)) {
        return true
      }

      logger.error('Skipping a rule because it could not be parsed')
      return false
    })
}

export const ruleViolationsCli = async (args: string[]) => {
  const logger = getLogger()

  const [rootFile, rulesFilePath] = args

  if (!notUndefined(rootFile) || !notUndefined(rulesFilePath)) {
    logger.error(`Invalid arguments: ${args}`)
    return
  }

  const rules = await readRulesFromFile(rulesFilePath)

  await violationsFromRuleFile({
    rootFile,
    rules
  })
}

const run = async (): Promise<void> => {
  const args = process.argv.slice(2)
  await ruleViolationsCli(args)
}

run()
