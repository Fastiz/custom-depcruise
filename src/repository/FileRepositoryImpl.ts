import {File} from "src/model/File";
import {ImportDependency} from "src/model/ImportDependency";
import {FileRepository} from 'src/repository/FileRepository';
import {TODO} from "src/util/todo";

export class FileRepositoryImpl implements FileRepository {
    listFilesInRootDirectory = (): File[] => {
        return TODO()
    }

    listFilesInDirectory = (): File[] => {
        return TODO()
    }

    readImportsFromSourceFile = (): ImportDependency[] => {
        return TODO()
    }
}