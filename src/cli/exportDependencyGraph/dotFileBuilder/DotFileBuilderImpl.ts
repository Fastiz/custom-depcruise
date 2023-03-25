import { DotFileBuilder } from './DotFileBuilder'

type Dependency = { from: string, to: string }

export class DotFileBuilderImpl implements DotFileBuilder {
  readonly dependencies: Dependency[] = []

  addDependency = (from: string, to: string): void => {
    this.dependencies.push({ from, to })
  }

  buildContentString = (): string => {
    let content = ''
    content = this.appendFileBeginning(content)
    content = this.appendEdgesLines(content)
    content = this.appendFileEnding(content)
    return content
  }

  appendFileBeginning = (content: string): string => {
    return content + 'digraph Dependencies {\n'
  }

  appendEdgesLines = (content: string): string => {
    this.dependencies.forEach(dep => {
      content += `${dep.from} -> ${dep.to};\n`
    })
    return content
  }

  appendFileEnding = (content: string): string => {
    return content + '}\n'
  }
}
