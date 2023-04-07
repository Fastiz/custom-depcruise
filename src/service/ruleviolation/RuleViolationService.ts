import { type ForbiddenDependencyRule } from 'src/model/ForbiddenDependencyRule'
import { type Violation } from 'src/model/Violation'
import { Node } from '../../model/graph/Node'
import { SourceFile } from '../../model/File'

export interface RuleViolationService {
  findViolations: (graph: Node<SourceFile>, rules: ForbiddenDependencyRule[]) => Violation[]
}
