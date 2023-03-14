import {DependencyTreeNode} from "src/model/DependencyTreeNode";
import {FileType, SourceFile} from "src/model/File";
import {FileRepository} from "src/repository/FileRepository";
import {DependencyTreeService} from "src/service/DependencyTreeService";

export class DependencyTreeServiceImpl implements DependencyTreeService{
    readonly fileRepository: FileRepository

    constructor(fileRepository: FileRepository) {
        this.fileRepository = fileRepository
    }

    buildDependencyTreeFromFilePath = (rootPath: string): DependencyTreeNode => {
        const sourceFile: SourceFile = { type: FileType.SOURCE_FILE, path: rootPath }
        return this.buildDependencyTreeFromRootPathRec(sourceFile)
    }

    buildDependencyTreeFromRootPathRec = (sourceFile: SourceFile): DependencyTreeNode => {
        const imports = this.fileRepository.readImportsFromSourceFile(sourceFile)
        const dependencies = imports
            .map(({to}) => this.buildDependencyTreeFromRootPathRec(to))

        return {
            nodeFile: sourceFile,
            dependencies
        }
    }
}