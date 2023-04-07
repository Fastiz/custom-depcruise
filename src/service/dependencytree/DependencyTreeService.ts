import { SourceFile } from '../../model/File'
import { NodeAsync } from '../../model/graph/NodeAsync'

export interface DependencyTreeService {
  buildDependencyTreeFromFilePathV2: (rootPath: string) => NodeAsync<SourceFile>
}
