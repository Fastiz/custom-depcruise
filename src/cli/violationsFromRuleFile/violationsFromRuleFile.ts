import { notUndefined } from 'src/util/notUndefined'
import { ForbiddenDependencyRule } from 'src/model/ForbiddenDependencyRule'
import { notNull } from '../../util/notNull'
import { parseRules } from './mapper/ruleFileParser'
import { iocContainer } from '../../configuration/iocContainer'

type Params = {
  rootFile: string
  rules: ForbiddenDependencyRule[]
}

const violationsFromRuleFile = async (params: Params) => {
  const {
    rootFile,
    rules
  } = params

  const dependencyTreeService = iocContainer.get().dependencyTreeService
  const ruleViolationService = iocContainer.get().ruleViolationService

  const tree = await dependencyTreeService.buildDependencyTreeFromFilePath(rootFile)

  const violations = ruleViolationService.findViolations(tree, rules)

  violations.forEach(violation => {
    console.log(violation)
  })
}

const readRulesFromFile = async (rulesFilePath: string): Promise<ForbiddenDependencyRule[]> => {
  const logger = iocContainer.get().logger
  const fileRepository = iocContainer.get().fileRepository

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
  iocContainer.initialize({})

  const logger = iocContainer.get().logger

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
