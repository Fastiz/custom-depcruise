import {DirectoryFile, File, SourceFile} from "src/model/File";

export interface FileRepository {
    listFilesInRootDirectory: (rootPath: string) => File[]
    listFilesInDirectory: (directory: DirectoryFile) => File[]
    readImportsFromSourceFile: (sourceFile: SourceFile) => ImportDependency[]
}