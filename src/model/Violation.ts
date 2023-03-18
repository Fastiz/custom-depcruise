import { type ForbiddenDependencyRule } from 'src/model/ForbiddenDependencyRule'
import { type ImportDependency } from 'src/model/ImportDependency'

export interface Violation {
  rule: ForbiddenDependencyRule
  importDependency: ImportDependency
}
