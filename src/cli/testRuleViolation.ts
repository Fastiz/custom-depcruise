import {getLogger} from "src/logger/LoggerProvider";
import {getDependencyTreeService} from "src/service/dependencytree/DependencyTreeServiceProvider";
import {getRuleViolationService} from "src/service/ruleviolation/RuleViolationServiceProvider";
import {notUndefined} from "src/util/notUndefined";

export const testRuleViolation = async (args: string[]) => {
    const logger = getLogger()

    const [rootFile, fromPattern, toPattern] = args

    if(!notUndefined(rootFile) || !notUndefined(fromPattern) || !notUndefined(toPattern)){
        const params = {rootFile, fromPattern, toPattern}

        logger.error(`Invalid parameters: ${params}`)
        return
    }

    const dependencyTreeService = getDependencyTreeService()
    const ruleViolationService = getRuleViolationService()

    const tree = await dependencyTreeService.buildDependencyTreeFromFilePath(rootFile)

    const rule = {name: 'test rule', toPattern, fromPattern}

    const violations = ruleViolationService.findViolations(tree, [rule])

    violations.forEach(console.log)
}