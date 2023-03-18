import { getLogger } from 'src/logger/LoggerProvider'
import { getDependencyTreeService } from 'src/service/dependencytree/DependencyTreeServiceProvider'
import { getRuleViolationService } from 'src/service/ruleviolation/RuleViolationServiceProvider'
import { notUndefined } from 'src/util/notUndefined'
import { ForbiddenDependencyRule } from 'src/model/ForbiddenDependencyRule'
import { getFileRepository } from 'src/repository/FileRepositoryProvider'
import { isLiteralObject } from 'src/util/isLiteralObject'
import { notNull } from 'src/util/notNull'

type Params = {
  rootFile: string
  rules: ForbiddenDependencyRule[]
}

const testRuleViolation = async (params: Params) => {

  const {
    rootFile,
    rules
  } = params

  const workingDirectory = process.cwd()

  const dependencyTreeService = getDependencyTreeService(workingDirectory)
  const ruleViolationService = getRuleViolationService()

  const tree = await dependencyTreeService.buildDependencyTreeFromFilePath(rootFile)

  const violations = ruleViolationService.findViolations(tree, rules)

  violations.forEach(violation => {
    console.log(violation)
  })
}

const parseRule = (readRule: unknown): ForbiddenDependencyRule | null => {
  if (!isLiteralObject(readRule)) {
    return null
  }

  if (!('name' in readRule) || !(typeof readRule.name === 'string')) {
    return null
  }

  if (!('fromPattern' in readRule) || !(typeof readRule.fromPattern === 'string')) {
    return null
  }

  if (!('toPattern' in readRule) || !(typeof readRule.toPattern === 'string')) {
    return null
  }

  const {
    name,
    fromPattern,
    toPattern
  } = readRule

  return {
    name,
    fromPattern,
    toPattern
  }
}

const parseRules = (readRules: unknown): (ForbiddenDependencyRule | null)[] | null => {
  if (!isLiteralObject(readRules)) {
    return null
  }

  if (!('rules' in readRules)) {
    return null
  }

  if (!Array.isArray(readRules.rules)) {
    return null
  }

  return readRules.rules
    .map(parseRule)
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

  await testRuleViolation({
    rootFile,
    rules
  })
}
