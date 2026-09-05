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

export function addObjectToMultiProjectDb(multiProjectDbPath: string, projectToAdd: project) {
    createAndFillJsonDb(multiProjectDbPath);

    const jsonData: project[] = jsonFileLibary.readFileSync(multiProjectDbPath)
    jsonData.push(projectToAdd)

    jsonFileLibary.writeFileSync(multiProjectDbPath, jsonData, { spaces: 2 })
}

export function removeObjectFromMultiProjectDb(multiProjectDbPath: string, globalDirectoryHash: string) {
    createAndFillJsonDb(multiProjectDbPath);

    let jsonData: project[] = jsonFileLibary.readFileSync(multiProjectDbPath)
    jsonData = jsonData.filter(item => item.projectPath == globalDirectoryHash)

    jsonFileLibary.writeFileSync(multiProjectDbPath, jsonData, { spaces: 2 })
}