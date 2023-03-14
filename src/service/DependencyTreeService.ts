import {DependencyTreeNode} from "src/model/DependencyTreeNode";

export interface DependencyTreeService {
    buildDependencyTreeFromRootPath: (rootPath: string) => DependencyTreeNode
}