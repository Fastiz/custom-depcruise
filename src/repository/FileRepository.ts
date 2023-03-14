import {SourceFile} from "src/model/File";
import {ImportDependency} from "src/model/ImportDependency";

export interface FileRepository {
    readImportsFromSourceFile: (sourceFile: SourceFile) => ImportDependency[]
}