export enum FileType {
    DIRECTORY = "DIRECTORY", SOURCE_FILE ="SOURCE_FILE"
}

export type File = {
    type: FileType
    path: string
}

export type SourceFile = {
    type: FileType.SOURCE_FILE
    path: string
}

export type DirectoryFile = {
    type: FileType.DIRECTORY
    path: string
}