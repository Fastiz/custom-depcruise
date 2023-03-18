import { type SourceFile } from 'src/model/File'
import { type ImportDependency } from 'src/model/ImportDependency'

export interface FileRepository {
  readImportsFromSourceFile: (sourceFile: SourceFile) => Promise<ImportDependency[]>
}
