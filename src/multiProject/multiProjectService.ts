import * as vscode from 'vscode';
import * as fs from "fs";
import * as jsonFileLibary from "jsonfile"
import path from 'path';
import { project } from "./interfaces/project";

export function getMultiProjectDbPath(context: vscode.ExtensionContext): string | undefined {
    try {
        return `${context.globalStorageUri.fsPath}${path.sep}multiProjectDb.json`;
    }
    catch {
        return undefined;
    }
}

export function createAndFillJsonDb(multiProjectDbPath: string): void | undefined {
    try {
        if (!fs.existsSync(multiProjectDbPath)) {
            fs.writeFileSync(multiProjectDbPath, '[]');
        }
    }
    catch {
        return undefined;
    }
}

// remove all entrys that are older than 60 days
export function garbageCollect(globalStoragePath: string, multiProjectDbPath: string): void | undefined {
    createAndFillJsonDb(multiProjectDbPath)

    try {
        let jsonData: project[] | undefined = getMultiProjectDbAsArray(multiProjectDbPath);
        if (jsonData == undefined) {
            return undefined
        }

        let arrayWithoutExpiredProjects: project[] = jsonData.filter(x => !x.lastOpenedDate.setDate(x.lastOpenedDate.getDate() + 60))
        // all hashes that are not longer available in arrayWithoutExpiredProjects, can be removed 
        let removedProjects = jsonData.filter(x => !arrayWithoutExpiredProjects.includes(x))
        // TODO: can this be done more efficient?
        removedProjects.forEach(project => {
            let pathToRemove: string = `${globalStoragePath}${path.sep}${project.globalDirectoryHash}`

            removeProjectFromMultiProjectDb(multiProjectDbPath, project.projectPath)
            fs.rmSync(pathToRemove, { recursive: true })
        });
    }
    catch {
        return undefined;
    }
}

export function addObjectToMultiProjectDb(multiProjectDbPath: string, projectToAdd: project): void | undefined {
    createAndFillJsonDb(multiProjectDbPath)

    try {
        let jsonData: project[] | undefined = getMultiProjectDbAsArray(multiProjectDbPath)
        if (jsonData == undefined) {
            return undefined
        }

        jsonData.push(projectToAdd)

        jsonFileLibary.writeFileSync(multiProjectDbPath, jsonData, { spaces: 2 })
    }
    catch {
        return undefined;
    }
}

export function getProjectByPath(multiProjectDbPath: string, path: string): project | undefined {
    createAndFillJsonDb(multiProjectDbPath)

    try {
        let jsonData: project[] | undefined = getMultiProjectDbAsArray(multiProjectDbPath)
        if (jsonData == undefined) {
            return undefined
        }

        const searchResult: project | undefined = jsonData.find(x => x.projectPath == path);
        if (searchResult == undefined) {
            vscode.window.showErrorMessage("BetterVSCHarpoon internal error");
            return;
        }

        return searchResult;
    }
    catch {
        return undefined;
    }
}

export function removeProjectFromMultiProjectDb(multiProjectDbPath: string, projectPath: string): void | undefined {
    createAndFillJsonDb(multiProjectDbPath)

    try {
        let jsonData: project[] | undefined = getMultiProjectDbAsArray(multiProjectDbPath)
        if (jsonData == undefined) {
            return undefined
        }

        jsonData = jsonData.filter(item => item.projectPath == projectPath)

        jsonFileLibary.writeFileSync(multiProjectDbPath, jsonData, { spaces: 2 })
    }
    catch {
        return undefined;
    }
}

export function getMultiProjectDbAsArray(multiProjectDbPath: string): project[] | undefined {
    createAndFillJsonDb(multiProjectDbPath)

    try {
        let jsonDataArray: project[] | undefined = jsonFileLibary.readFileSync(multiProjectDbPath)
        if (jsonDataArray == undefined) {
            return undefined
        }

        return jsonDataArray
    }
    catch {
        return undefined;
    }
}

export function multiProjectDbIncludesPath(multiProjectDbPath: string, path: string): boolean | undefined {
    createAndFillJsonDb(multiProjectDbPath)

    try {
        let jsonData: project[] | undefined = getMultiProjectDbAsArray(multiProjectDbPath)
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

export function updateDbProjectDate(multiProjectDbPath: string, path: string): void | undefined {
    createAndFillJsonDb(multiProjectDbPath)

    try {
        let jsonData: project[] | undefined = getMultiProjectDbAsArray(multiProjectDbPath)
        if (jsonData == undefined) {
            return undefined
        }

        const search = jsonData.find(x => x.projectPath == path);
        if (search == undefined) {
            vscode.window.showErrorMessage("BetterVSCHarpoon internal error");
            return;
        }

        search.lastOpenedDate = new Date()
        jsonFileLibary.writeFileSync(multiProjectDbPath, jsonData, { spaces: 2 })
    }
    catch {
        return undefined;
    }
}
