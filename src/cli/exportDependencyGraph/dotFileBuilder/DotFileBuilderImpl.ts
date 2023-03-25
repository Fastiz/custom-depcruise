import { DotFileBuilder } from './DotFileBuilder'
import { notUndefined } from '../../../util/notUndefined'
import { changeOfBase } from '../../../util/changeOfBase'

type Dependency = { from: string, to: string }

const indexToNodeName = (index: number): string => {
  const baseAlphabet = 'abcdefghijklmnopqrstuvwxyz'
  return changeOfBase(index, baseAlphabet)
}

export class DotFileBuilderImpl implements DotFileBuilder {
  readonly dependencies: Dependency[] = []

  addDependency = (from: string, to: string): void => {
    this.dependencies.push({
      from,
      to
    })
  }

  buildContentString = (): string => {
    const pathToName = this.buildPathToNamesMap()

    let content = ''
    content += this.appendFileBeginning()
    content += this.appendNodeLines(pathToName)
    content += this.appendEdgeLines(pathToName)
    content += this.appendFileEnding()
    return content
  }

  buildPathToNamesMap = (): Map<string, string> => {
    const uniqueNodes = [...new Set<string>(
      this.dependencies.flatMap(({
        from,
        to
      }) => [from, to])
    )]

    const result = new Map<string, string>()
    uniqueNodes.forEach((node, index) => {
      const name = indexToNodeName(index)
      result.set(node, name)
    })

    return result
  }

  appendFileBeginning = (): string => {
    return 'digraph Dependencies {\n'
  }

  appendNodeLines = (pathToName: Map<string, string>): string => {
    const nodes = [...pathToName.entries()]

    let content = ''
    nodes.forEach(([path, name]) => {
      content += `${name} [label = "${path}"];\n`
    })

    return content
  }

  appendEdgeLines = (pathToName: Map<string, string>): string => {
    let content = ''

    this.dependencies.forEach(dep => {
      const fromName = pathToName.get(dep.from)
      const toName = pathToName.get(dep.to)

      if (!notUndefined(fromName) || !notUndefined(toName)) {
        throw Error('Invalid state exception')
      }

      content += `${fromName} -> ${toName};\n`
    })

    return content
  }

  appendFileEnding = (): string => {
    return '}\n'
  }
}
