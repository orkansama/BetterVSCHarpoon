import * as vscode from 'vscode';
import * as fs from "fs";
import * as jsonFileLibary from "jsonfile"
import path from 'path';
import { project } from "./interfaces/project";

export function getMultiProjectDbPath(context: vscode.ExtensionContext): string {
    return `${context.globalStorageUri.fsPath}${path.sep}multiProjectDb.json`;
}

export function createAndFillJsonDb(multiProjectDbPath: string) {
    if (!fs.existsSync(multiProjectDbPath)) {
        fs.writeFileSync(multiProjectDbPath, '[]');
    }
}

// GarbageCollection
// export function checkForExpiredProjects(multiProjectDbPath: string): project | undefined {

// }

export function addObjectToMultiProjectDb(multiProjectDbPath: string, projectToAdd: project) {
    let jsonData: project[] = getMultiProjectDbAsArray(multiProjectDbPath)
    jsonData.push(projectToAdd)

    jsonFileLibary.writeFileSync(multiProjectDbPath, jsonData, { spaces: 2 })
}

export function getProjectByPath(multiProjectDbPath: string, path: string): project | undefined {
    let jsonData: project[] = getMultiProjectDbAsArray(multiProjectDbPath)

    const searchResult: project | undefined = jsonData.find(x => x.projectPath == path);
    if (searchResult == undefined) {
        vscode.window.showErrorMessage("BetterVSCHarpoon internal error");
        return;
    }

    return searchResult;
}


export function removeProjectFromMultiProjectDb(multiProjectDbPath: string, projectPath: string) {
    let jsonData: project[] = getMultiProjectDbAsArray(multiProjectDbPath)
    jsonData = jsonData.filter(item => item.projectPath == projectPath)

    jsonFileLibary.writeFileSync(multiProjectDbPath, jsonData, { spaces: 2 })
}

export function getMultiProjectDbAsArray(multiProjectDbPath: string): project[] {
    let jsonDataArray: project[] = jsonFileLibary.readFileSync(multiProjectDbPath)
    return jsonDataArray
}

export function multiProjectDbIncludesPath(multiProjectDbPath: string, path: string): boolean {
    let jsonData: project[] = getMultiProjectDbAsArray(multiProjectDbPath)

    const search = jsonData.find(x => x.projectPath == path);
    if (search == undefined) {
        return false
    }

    return true
}

export function updateDbProjectDate(multiProjectDbPath: string, path: string) {
    let jsonData: project[] = getMultiProjectDbAsArray(multiProjectDbPath)

    const search = jsonData.find(x => x.projectPath == path);
    if (search == undefined) {
        vscode.window.showErrorMessage("BetterVSCHarpoon internal error");
        return;
    }

    search.lastOpenedDate = new Date().toLocaleDateString()
    jsonFileLibary.writeFileSync(multiProjectDbPath, jsonData, { spaces: 2 })
}
