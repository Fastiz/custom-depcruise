import {getFileRepository} from "src/repository/FileRepositoryProvider";
import {DependencyTreeService} from "src/service/dependencytree/DependencyTreeService";
import {DependencyTreeServiceImpl} from "src/service/dependencytree/DependencyTreeServiceImpl";

export const getDependencyTreeServiceProvider = (): DependencyTreeService => {
    const fileRepository = getFileRepository()
    return new DependencyTreeServiceImpl(fileRepository)
}