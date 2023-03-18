import { type SourceFile } from 'src/model/File'

export interface ImportDependency {
  from: SourceFile
  to: SourceFile
}
