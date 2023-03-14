import {getLogger} from "src/logger/LoggerProvider";
import {FileRepository} from "src/repository/FileRepository";
import {FileRepositoryImpl} from "src/repository/FileRepositoryImpl";

export const getFileRepository = (): FileRepository => {
    const logger = getLogger()
    return new FileRepositoryImpl(logger)
}