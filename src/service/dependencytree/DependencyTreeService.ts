import {DependencyTreeNode} from "src/model/DependencyTreeNode";

export interface DependencyTreeService {
    buildDependencyTreeFromFilePath: (rootPath: string) => Promise<DependencyTreeNode>
}