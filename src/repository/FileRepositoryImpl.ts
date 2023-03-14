import {ImportDependency} from "src/model/ImportDependency";
import {FileRepository} from 'src/repository/FileRepository';
import {TODO} from "src/util/todo";

export class FileRepositoryImpl implements FileRepository {
    readImportsFromSourceFile = (): ImportDependency[] => {
        return TODO()
    }
}