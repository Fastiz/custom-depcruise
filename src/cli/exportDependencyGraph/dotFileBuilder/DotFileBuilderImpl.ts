import { DotFileBuilder } from './DotFileBuilder'
import { notUndefined } from '../../../util/notUndefined'
import { changeOfBase } from '../../../util/changeOfBase'

type Dependency = { fromLabel: string, toLabel: string }

const indexToNodeName = (index: number): string => {
  const baseAlphabet = 'abcdefghijklmnopqrstuvwxyz'
  return changeOfBase(index, baseAlphabet)
}

export class DotFileBuilderImpl implements DotFileBuilder {
  readonly dependencies: Dependency[] = []

  addDependency = (fromLabel: string, toLabel: string): void => {
    this.dependencies.push({
      fromLabel,
      toLabel
    })
  }

  buildContentString = (): string => {
    const labelToName = this.buildLabelToNamesMap()

    let content = ''
    content += this.appendFileBeginning()
    content += this.appendNodeLines(labelToName)
    content += this.appendEdgeLines(labelToName)
    content += this.appendFileEnding()
    return content
  }

  buildLabelToNamesMap = (): Map<string, string> => {
    const uniqueNodes = [...new Set<string>(
      this.dependencies.flatMap(({
        fromLabel,
        toLabel
      }) => [fromLabel, toLabel])
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

  appendNodeLines = (labelToName: Map<string, string>): string => {
    const nodes = [...labelToName.entries()]

    let content = ''
    nodes.forEach(([label, name]) => {
      content += `${name} [label = "${label}"];\n`
    })

    return content
  }

  appendEdgeLines = (labelToName: Map<string, string>): string => {
    let content = ''

    this.dependencies.forEach(dep => {
      const fromName = labelToName.get(dep.fromLabel)
      const toName = labelToName.get(dep.toLabel)

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
