import { type RuleViolationService } from 'src/service/ruleviolation/RuleViolationService'
import { RuleViolationServiceImpl } from 'src/service/ruleviolation/RuleViolationServiceImpl'

export const getRuleViolationService = (): RuleViolationService => {
  return new RuleViolationServiceImpl()
}
