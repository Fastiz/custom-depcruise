import { type DependencyTreeNode } from 'src/model/DependencyTreeNode'
import { type ForbiddenDependencyRule } from 'src/model/ForbiddenDependencyRule'
import { type Violation } from 'src/model/Violation'

export interface RuleViolationService {
  findViolations: (dependencyTree: DependencyTreeNode, rules: ForbiddenDependencyRule[]) => Violation[]
}
