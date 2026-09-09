import { multiProjectService } from "./multiProjectService";
import * as vscode from 'vscode';
import * as fs from "fs";
import * as jsonFileLibary from "jsonfile"
import { project } from "./interfaces/project";
import { error } from "./error/error";
import path from "path";

export class multiProjectServiceFactory {
    public static createMultiProjectService(context: vscode.ExtensionContext): multiProjectService | error {
        const JSON_DB_PATH = `${context.globalStorageUri.fsPath}${path.sep}JsonDb.json`;
        let jsonDbArray: project[] = []

        try {
            if (!fs.existsSync(JSON_DB_PATH)) {
                fs.writeFileSync(JSON_DB_PATH, '[]');
            }
        }
        catch {
            let error: error = {
                code: "activate",
                message: "failed to ensure database exists"
            }

            return error;
        }

        try {
            let jsonDataArray: project[] = jsonFileLibary.readFileSync(JSON_DB_PATH)
            jsonDbArray = jsonDataArray;
        }
        catch {
            let error: error = {
                code: "activate",
                message: "failed to create array from database"
            }

            return error;
        }

        return new multiProjectService(context, JSON_DB_PATH, jsonDbArray);
    }
}