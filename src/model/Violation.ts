import {ForbiddenDependencyRule} from "src/model/ForbiddenDependencyRule";
import {ImportDependency} from "src/model/ImportDependency";

export type Violation = {
    rule: ForbiddenDependencyRule
    importDependency: ImportDependency
}