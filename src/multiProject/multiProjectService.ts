import * as vscode from 'vscode';
import * as fs from "fs";
import * as jsonFileLibary from "jsonfile"
import path from 'path';
import { project } from "./interfaces/project";

export function getJsonDbPath(context: vscode.ExtensionContext): string | undefined {
    try {
        return `${context.globalStorageUri.fsPath}${path.sep}JsonDb.json`;
    }
    catch {
        return undefined;
    }
}

export function createAndFillJsonDb(jsonDbPath: string): void | undefined {
    try {
        if (!fs.existsSync(jsonDbPath)) {
            fs.writeFileSync(jsonDbPath, '[]');
        }
    }
    catch {
        return undefined;
    }
}

// remove all entrys that are older than 60 days
export function garbageCollectJsonDb(globalStoragePath: string, jsonDbPath: string): void | undefined {
    createAndFillJsonDb(jsonDbPath)

    try {
        let jsonData: project[] | undefined = getJsonDbAsArray(jsonDbPath);
        if (jsonData == undefined) {
            return undefined
        }

        let arrayWithoutExpiredProjects: project[] = jsonData.filter(x => !x.lastOpenedDate.setDate(x.lastOpenedDate.getDate() + 60))
        // all hashes that are not longer available in arrayWithoutExpiredProjects, can be removed 
        let removedProjects = jsonData.filter(x => !arrayWithoutExpiredProjects.includes(x))
        // TODO: can this be done more efficient?
        removedProjects.forEach(project => {
            let pathToRemove: string = `${globalStoragePath}${path.sep}${project.globalDirectoryHash}`

            removeProjectFromJsonDb(jsonDbPath, project.projectPath)
            fs.rmSync(pathToRemove, { recursive: true })
        });
    }
    catch {
        return undefined;
    }
}

export function addProjectToJsonDb(jsonDbPath: string, projectToAdd: project): void | undefined {
    createAndFillJsonDb(jsonDbPath)

    try {
        let jsonData: project[] | undefined = getJsonDbAsArray(jsonDbPath)
        if (jsonData == undefined) {
            return undefined
        }

        jsonData.push(projectToAdd)

        jsonFileLibary.writeFileSync(jsonDbPath, jsonData, { spaces: 2 })
    }
    catch {
        return undefined;
    }
}

export function getProjectFromJsonDbByPath(jsonDbPath: string, path: string): project | undefined {
    createAndFillJsonDb(jsonDbPath)

    try {
        let jsonData: project[] | undefined = getJsonDbAsArray(jsonDbPath)
        if (jsonData == undefined) {
            return undefined
        }

        const searchResult: project | undefined = jsonData.find(x => x.projectPath == path);
        if (searchResult == undefined) {
            return undefined;
        }

        return searchResult;
    }
    catch {
        return undefined;
    }
}

export function removeProjectFromJsonDb(jsonDbPath: string, projectPath: string): void | undefined {
    createAndFillJsonDb(jsonDbPath)

    try {
        let jsonData: project[] | undefined = getJsonDbAsArray(jsonDbPath)
        if (jsonData == undefined) {
            return undefined
        }

        jsonData = jsonData.filter(item => item.projectPath == projectPath)

        jsonFileLibary.writeFileSync(jsonDbPath, jsonData, { spaces: 2 })
    }
    catch {
        return undefined;
    }
}

export function getJsonDbAsArray(jsonDbPath: string): project[] | undefined {
    createAndFillJsonDb(jsonDbPath)

    try {
        let jsonDataArray: project[] | undefined = jsonFileLibary.readFileSync(jsonDbPath)
        if (jsonDataArray == undefined) {
            return undefined
        }

        return jsonDataArray
    }
    catch {
        return undefined;
    }
}

export function jsonDbIncludesPath(jsonDbPath: string, path: string): boolean | undefined {
    createAndFillJsonDb(jsonDbPath)

    try {
        let jsonData: project[] | undefined = getJsonDbAsArray(jsonDbPath)
        if (jsonData == undefined) {
            return undefined
        }

        const search = jsonData.find(x => x.projectPath == path);
        if (search == undefined) {
            return false
        }

        return true
    } catch {
        return undefined;
    }
}

export function updateJsonDbProjectDate(jsonDbPath: string, path: string): void | undefined {
    createAndFillJsonDb(jsonDbPath)

    try {
        let jsonData: project[] | undefined = getJsonDbAsArray(jsonDbPath)
        if (jsonData == undefined) {
            return undefined
        }

        const search = jsonData.find(x => x.projectPath == path);
        if (search == undefined) {
            return undefined;
        }

        search.lastOpenedDate = new Date()
        jsonFileLibary.writeFileSync(jsonDbPath, jsonData, { spaces: 2 })
    }
    catch {
        return undefined;
    }
}
