import { type SourceFile } from 'src/model/File'
import { type ImportDependency } from 'src/model/ImportDependency'
import { Observer } from '../util/observer'

export interface FileRepository {
  readLinesFromFile: (filePath: string, lineObserver: Observer<string>) => Promise<void>
  readImportsFromSourceFile: (sourceFile: SourceFile) => Promise<ImportDependency[]>
}
