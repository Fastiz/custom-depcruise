import {DependencyTreeNode} from "src/model/DependencyTreeNode";
import {FileRepository} from "src/repository/FileRepository";
import {DependencyTreeService} from "src/service/DependencyTreeService";
import {TODO} from "src/util/todo";

export class DependencyTreeServiceImpl implements DependencyTreeService{
    readonly fileRepository: FileRepository

    constructor(fileRepository: FileRepository) {
        this.fileRepository = fileRepository
    }

    buildDependencyTreeFromRootPath = (): DependencyTreeNode => {
        return TODO()
    }
}