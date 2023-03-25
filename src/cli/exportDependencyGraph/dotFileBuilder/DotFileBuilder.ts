export interface DotFileBuilder {
  addDependency: (from: string, to: string) => void
  buildContentString: () => string
}
