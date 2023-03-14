import {FileRepository} from "src/repository/FileRepository";
import {FileRepositoryImpl} from "src/repository/FileRepositoryImpl";

export const getFileRepository = (): FileRepository => {
    return new FileRepositoryImpl()
}