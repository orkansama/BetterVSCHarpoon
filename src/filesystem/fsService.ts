import { mkdirSync, openSync, rmSync } from 'fs';
import { error } from "../models/error";
import { resolve } from 'path';

export function createFile(directoryPath: string, filePath: string): void | error {
    try {
        mkdirSync(directoryPath, { recursive: true });
        openSync(filePath, 'a');
    }
    catch (e) {
        const error: error = {
            code: "createFile",
            message: `an error occured: ${e}`
        };

        return error;
    }
}

export function removeDirectoryArrayRecursive(globalStoragePath: string, directoryPathArray: string[]): void | error {
    try {
        directoryPathArray.forEach(orphanedDirectory => {
            const pathToRemove = resolve(globalStoragePath, orphanedDirectory)
            rmSync(pathToRemove, { recursive: true, force: true })
        });
    }
    catch (e) {
        const error: error = {
            code: "removeDirectoryRecursive",
            message: `an error occured: ${e}`
        };

        return error;
    }
}