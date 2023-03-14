import {getFileRepository} from "src/repository/FileRepositoryProvider";
import {DependencyTreeService} from "src/service/DependencyTreeService";
import {DependencyTreeServiceImpl} from "src/service/DependencyTreeServiceImpl";

export const getDependencyTreeServiceProvider = (): DependencyTreeService => {
    const fileRepository = getFileRepository()
    return new DependencyTreeServiceImpl(fileRepository)
}