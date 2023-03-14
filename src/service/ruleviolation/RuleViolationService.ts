import {DependencyTreeNode} from "src/model/DependencyTreeNode";
import {ForbiddenDependencyRule} from "src/model/ForbiddenDependencyRule";
import {Violation} from "src/model/Violation";

export interface RuleViolationService {
    findViolations: (dependencyTree: DependencyTreeNode, rules: ForbiddenDependencyRule[]) => Violation[]
}