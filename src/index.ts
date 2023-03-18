import { ruleViolationsCli } from 'src/cli/violationsFromRuleFile/violationsFromRuleFile'

ruleViolationsCli(['src/index', './rules-config.json'])
