import { SourceFile } from '../../model/File'
import { NodeAsync } from '../../model/graph/NodeAsync'

export interface DependencyTreeService {
  buildDependencyTreeFromFilePath: (rootPath: string) => NodeAsync<SourceFile>
}
