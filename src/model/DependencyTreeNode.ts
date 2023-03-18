import { type SourceFile } from 'src/model/File'

export interface DependencyTreeNode {
  nodeFile: SourceFile
  dependencies: DependencyTreeNode[]
}
