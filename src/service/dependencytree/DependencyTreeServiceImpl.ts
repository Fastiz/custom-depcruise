import {DependencyTreeNode} from "src/model/DependencyTreeNode";
import {SourceFile} from "src/model/File";
import {FileRepository} from "src/repository/FileRepository";
import {DependencyTreeService} from "src/service/dependencytree/DependencyTreeService";

export class DependencyTreeServiceImpl implements DependencyTreeService{
    readonly fileRepository: FileRepository

    constructor(fileRepository: FileRepository) {
        this.fileRepository = fileRepository
    }

    buildDependencyTreeFromFilePath = async (rootPath: string): Promise<DependencyTreeNode> => {
        const sourceFile: SourceFile = { path: rootPath }
        return await this.buildDependencyTreeFromRootPathRec(sourceFile)
    }

    buildDependencyTreeFromRootPathRec = async (sourceFile: SourceFile): Promise<DependencyTreeNode> => {
        const imports = await this.fileRepository.readImportsFromSourceFile(sourceFile)
        const dependencies = await Promise.all(imports
            .map(({to}) => this.buildDependencyTreeFromRootPathRec(to)))

        return {
            nodeFile: sourceFile,
            dependencies
        }
    }
}