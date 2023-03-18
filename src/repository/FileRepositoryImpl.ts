import { type Logger } from 'src/logger/Logger'
import { type SourceFile } from 'src/model/File'
import { type ImportDependency } from 'src/model/ImportDependency'
import { type FileRepository } from 'src/repository/FileRepository'
import fs from 'fs'
import readline from 'readline'
import { findFirstOf, findLastOf } from 'src/util/findSearchString'
import { Observer } from 'src/util/observer'

export class FileRepositoryImpl implements FileRepository {
  readonly logger: Logger

  constructor (logger: Logger) {
    this.logger = logger
  }

  readLinesFromFile = async (filePath: string, lineObserver: Observer<string>) => {
    const fileStream = fs.createReadStream(filePath)

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    })

    try {
      for await (const line of rl) {
        lineObserver.next(line)
      }
    } catch (e) {
      const errorMessage = `An error occurred when reading file: ${filePath}`
      this.logger.error(errorMessage)
      throw Error(errorMessage)
    }
  }

  readImportsFromSourceFile = async (sourceFile: SourceFile): Promise<ImportDependency[]> => {
    const importStrings = await this.readImportStrings(`${sourceFile.path}.ts`)

    if (importStrings == null) {
      return []
    }

    const importStringToImportDependency = (to: string) => {
      const targetFile = { path: to }
      return {
        from: sourceFile,
        to: targetFile
      }
    }

    return importStrings.map(importStringToImportDependency)
  }

  readImportStrings = async (filePath: string): Promise<string[] | null> => {
    const imports: string[] = []

    const readLine = (line: string) => {
      if (!line.startsWith('import')) {
        return
      }

      const start = findFirstOf(line, ['\'', '"', '`'])
      const end = findLastOf(line, ['\'', '"', '`'])

      if (start == null || end == null) {
        this.logger.warn(`Line that starts with 'import' has an invalid format: ${line}`)
        return
      }

      const i = line.substring(start + 1, end)

      imports.push(i)
    }

    try {
      await this.readLinesFromFile(filePath, { next: readLine })
    } catch (e) {
      this.logger.error(`Skipping file with path: ${filePath}`)
      return null
    }

    return imports
  }
}
