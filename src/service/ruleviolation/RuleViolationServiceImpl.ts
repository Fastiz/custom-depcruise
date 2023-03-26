import { type DependencyTreeNode } from 'src/model/dependencyTreeNode/DependencyTreeNode'
import { type ForbiddenDependencyRule } from 'src/model/ForbiddenDependencyRule'
import { type ImportDependency } from 'src/model/ImportDependency'
import { type Violation } from 'src/model/Violation'
import { type RuleViolationService } from 'src/service/ruleviolation/RuleViolationService'
import { notNull } from 'src/util/notNull'

export class RuleViolationServiceImpl implements RuleViolationService {
  findViolations = (dependencyTree: DependencyTreeNode, rules: ForbiddenDependencyRule[]): Violation[] => {
    return this.findViolationsRec(dependencyTree, rules)
  }

  findViolationsRec = (dependencyTree: DependencyTreeNode, rules: ForbiddenDependencyRule[]): Violation[] => {
    if (dependencyTree.dependencies.length === 0) {
      return []
    }

    const nodeViolations = dependencyTree.dependencies.flatMap((dependency) => {
      const importDependency = {
        from: dependencyTree.nodeFile,
        to: dependency.nodeFile
      }

      return this.applyRules(importDependency, rules)
    })

    const childrenViolations = dependencyTree.dependencies.flatMap((dependency) => {
      return this.findViolationsRec(dependency, rules)
    })

    const allViolations = [
      ...nodeViolations,
      ...childrenViolations
    ]

    return this.filterUniqueViolations(allViolations)
  }

  applyRules = (importDependency: ImportDependency, rules: ForbiddenDependencyRule[]): Violation[] => {
    const mapToViolationOrNull = (rule: ForbiddenDependencyRule) => {
      if (!this.testRule(importDependency, rule)) {
        return null
      }

      return {
        rule,
        importDependency
      }
    }

    return rules
      .map(mapToViolationOrNull)
      .filter(notNull)
  }

  testRule = (importDependency: ImportDependency, rule: ForbiddenDependencyRule): boolean => {
    const toRegex = new RegExp(rule.toPattern)
    const fromRegex = new RegExp(rule.fromPattern)

    if (!toRegex.test(importDependency.to.path)) {
      return false
    }

    return fromRegex.test(importDependency.from.path)
  }

  filterUniqueViolations = (violations: Violation[]): Violation[] => {
    const extractKey = (violation: Violation): string => {
      return `${violation.rule.name}:${violation.importDependency.from.path}:${violation.importDependency.to.path}`
    }

    const found = new Set<string>()

    return violations.filter(violation => {
      const key = extractKey(violation)

      if (found.has(key)) {
        return false
      }

      found.add(key)
      return true
    })
  }
}
