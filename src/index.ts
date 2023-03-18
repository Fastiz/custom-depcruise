import { testRuleViolation } from './cli/testRuleViolation'

testRuleViolation(['./src/index.ts', 'FileRepositoryProvider', 'FileRepositoryImpl'])
