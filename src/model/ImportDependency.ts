import {SourceFile} from "src/model/File";

export type ImportDependency = {
    from: SourceFile
    to: SourceFile
}