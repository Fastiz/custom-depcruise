import {File} from "src/model/File";
import {FileRepository} from 'src/repository/FileRepository';

export class FileRepositoryImpl implements FileRepository {
    listFilesInRootDirectory = (): File[] => {
        throw Error("not implemented")
    }

    listFilesInDirectory = (): File[] => {
        throw Error("not implemented")
    }

    readImportsFromSourceFile = (): ImportDependency[] => {
        throw Error("not implemented")
    }
}