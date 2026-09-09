import path from "path";
import { multiProjectService } from "./multiProjectService";
import { ExtensionContext } from 'vscode';
import { existsSync, writeFileSync } from "fs";
import { readFileSync } from "jsonfile"
import { project } from "./interfaces/project";
import { error } from "./error/error";

export class multiProjectServiceFactory {
    public static createMultiProjectService(context: ExtensionContext): multiProjectService | error {
        const JSON_DB_PATH = `${context.globalStorageUri.fsPath}${path.sep}JsonDb.json`;
        let jsonDbArray: project[] = []

        try {
            if (!existsSync(JSON_DB_PATH)) {
                writeFileSync(JSON_DB_PATH, '[]');
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
            let jsonDataArray: project[] = readFileSync(JSON_DB_PATH)
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