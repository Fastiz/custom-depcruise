import {Logger} from "src/logger/Logger";
import {SourceFile} from "src/model/File";
import {ImportDependency} from "src/model/ImportDependency";
import {FileRepository} from 'src/repository/FileRepository';
import fs from "fs";
import readline from "readline";
import {findFirstOf, findLastOf} from "src/repository/util/findSearchString";

export class FileRepositoryImpl implements FileRepository {
    readonly logger: Logger

    constructor(logger: Logger) {
        this.logger = logger
    }

    readImportsFromSourceFile = async (sourceFile: SourceFile): Promise<ImportDependency[]> => {
        const importStrings = await this.readImportStrings(sourceFile.path)

        const importStringToImportDependency = (to: string) => {
            const targetFile = {path: to}
            return {
                from: sourceFile,
                to: targetFile
            }
        }

        return importStrings.map(importStringToImportDependency)
    }

    readImportStrings = async (filePath: string): Promise<string[]> => {
        const fileStream = fs.createReadStream(filePath)

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        })

        const imports: string[] = []

        for await (const line of rl) {
            if(!line.startsWith('import')){
                continue
            }

            const start = findFirstOf(line, ['\'', '"', '`'])
            const end = findLastOf(line, ['\'', '"', '`'])

            if(start == null || end == null){
                this.logger.warn(`Line that starts with 'import' has an invalid format: ${line}`)
                continue
            }

            const i = line.substring(start + 1, end)

            imports.push(i)
        }

        return imports
    }
}

