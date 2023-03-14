import {ForbiddenDependencyRule} from "src/model/ForbiddenDependencyRule";
import {Violation} from "src/model/Violation";

export interface RuleViolationService {
    findViolations: (rules: ForbiddenDependencyRule[]) => Violation[]
}