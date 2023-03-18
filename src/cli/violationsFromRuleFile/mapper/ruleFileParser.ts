import { ForbiddenDependencyRule } from '../../../model/ForbiddenDependencyRule'
import { isLiteralObject } from '../../../util/isLiteralObject'

const parseRule = (readRule: unknown): ForbiddenDependencyRule | null => {
  if (!isLiteralObject(readRule)) {
    return null
  }

  if (!('name' in readRule) || !(typeof readRule.name === 'string')) {
    return null
  }

  if (!('fromPattern' in readRule) || !(typeof readRule.fromPattern === 'string')) {
    return null
  }

  if (!('toPattern' in readRule) || !(typeof readRule.toPattern === 'string')) {
    return null
  }

  const {
    name,
    fromPattern,
    toPattern
  } = readRule

  return {
    name,
    fromPattern,
    toPattern
  }
}

export const parseRules = (readRules: unknown): (ForbiddenDependencyRule | null)[] | null => {
  if (!isLiteralObject(readRules)) {
    return null
  }

  if (!('rules' in readRules)) {
    return null
  }

  if (!Array.isArray(readRules.rules)) {
    return null
  }

  return readRules.rules
    .map(parseRule)
}

