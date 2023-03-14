import {SourceFile} from "src/model/File";

export type DependencyTreeNode = {
    nodeFile: SourceFile
    dependencies: DependencyTreeNode[]
}