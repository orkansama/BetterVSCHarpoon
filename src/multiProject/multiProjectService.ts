import * as vscode from 'vscode';
import * as fs from "fs";
import * as jsonFileLibary from "jsonfile"
import path from 'path';
import { project } from "./interfaces/project";
import dayjs from "dayjs";
import { error } from "./error/error";

export class multiProjectService {
    public _context: vscode.ExtensionContext;
    public _jsonDbPath: string;
    public _jsonProjectDataArray: project[];

    public constructor(context: vscode.ExtensionContext, jsonDbPath: string, jsonProjectDataArray: project[]) {
        this._context = context
        this._jsonDbPath = jsonDbPath
        this._jsonProjectDataArray = jsonProjectDataArray
    }

    public getJsonDbPath() {
        try {
            return `${this._context.globalStorageUri.fsPath}${path.sep}JsonDb.json`;
        }
        catch {
            let errorToReturn: error = {
                code: "getJsonDbPath",
                message: "failed to create list"
            }

            vscode.window.showErrorMessage(`${errorToReturn.code} ${errorToReturn.message}`);
            return;
        }
    }

    public createAndFillJsonDb() {
        try {
            if (!fs.existsSync(this._jsonDbPath)) {
                fs.writeFileSync(this._jsonDbPath, '[]');
            }
        }
        catch {
            let errorToReturn: error = {
                code: "createAndFillJsonDb",
                message: "failed to verify or create db"
            }

            vscode.window.showErrorMessage(`${errorToReturn.code} ${errorToReturn.message}`);
            return;
        }
    }

    public getJsonDbAsArray() {
        try {
            let jsonDataArray: project[] = jsonFileLibary.readFileSync(this._jsonDbPath)
            return jsonDataArray
        }
        catch {
            let errorToReturn: error = {
                code: "getJsonDbAsArray",
                message: "failed to read db"
            }

            vscode.window.showErrorMessage(`${errorToReturn.code} ${errorToReturn.message}`);
            return;
        }
    }

    // remove all entrys that are older than 60 days
    public garbageCollectJsonDb() {
        try {
            const expiredProjects = this.findExpiredProjects()

            // TODO: can this be done more efficient?
            expiredProjects.forEach(project => {
                let pathToRemove: string = `${this._context.globalStorageUri.fsPath}${path.sep}${project.globalDirectoryHash}`
                this.removeProjectFromJsonDb(project.projectPath)
                fs.rmSync(pathToRemove, { recursive: true })
            });
        }
        catch {
            let errorToReturn: error = {
                code: "garbageCollectJsonDb",
                message: "failed to garbage collect db"
            }

            vscode.window.showErrorMessage(`${errorToReturn.code} ${errorToReturn.message}`);
            return;
        }
    }

    public findExpiredProjects() {
        let expiredProjects: project[] = this._jsonProjectDataArray.filter(x => {
            let expiredAt = dayjs(x.lastOpenedDate).add(60, "days");
            let now = dayjs(new Date())

            return expiredAt < now
        })

        return expiredProjects;
    }

    public addProjectToJsonDb(projectToAdd: project) {
        try {
            this._jsonProjectDataArray.push(projectToAdd)
            jsonFileLibary.writeFileSync(this._jsonDbPath, this._jsonProjectDataArray, { spaces: 2 })
        }
        catch {
            let errorToReturn: error = {
                code: "addProjectToJsonDb",
                message: "failed to add project to db"
            }

            vscode.window.showErrorMessage(`${errorToReturn.code} ${errorToReturn.message}`);
            return;
        }
    }

    public getProjectFromJsonDbByPath(path: string) {
        try {
            const searchResult: project | undefined = this._jsonProjectDataArray.find(x => x.projectPath == path);
            if (searchResult == undefined) {
                let errorToReturn: error = {
                    code: "getProjectFromJsonDbByPath",
                    message: `desired path ${path} not found`
                }

                vscode.window.showErrorMessage(`${errorToReturn.code} ${errorToReturn.message}`);
                return;
            }
            return searchResult;
        }
        catch {
            let errorToReturn: error = {
                code: "getProjectFromJsonDbByPath",
                message: "failed to get project from db"
            }

            vscode.window.showErrorMessage(`${errorToReturn.code} ${errorToReturn.message}`);
            return;
        }
    }

    public removeProjectFromJsonDb(projectPath: string) {
        try {
            this._jsonProjectDataArray = this._jsonProjectDataArray.filter(item => item.projectPath != projectPath)
            jsonFileLibary.writeFileSync(this._jsonDbPath, this._jsonProjectDataArray, { spaces: 2 })
        }
        catch {
            let errorToReturn: error = {
                code: "removeProjectFromJsonDb",
                message: "failed to remove project from db"
            }

            vscode.window.showErrorMessage(`${errorToReturn.code} ${errorToReturn.message}`);
            return;
        }
    }

    public jsonDbIncludesPath(path: string) {
        try {
            const search = this._jsonProjectDataArray.find(x => x.projectPath == path);
            if (search == undefined) {
                return false
            }

            return true
        }
        catch {
            let errorToReturn: error = {
                code: "jsonDbIncludesPath",
                message: "failed to check db for project"
            }

            vscode.window.showErrorMessage(`${errorToReturn.code} ${errorToReturn.message}`);
            return;
        }
    }

    public updateJsonDbProjectDate(path: string) {
        try {
            const search = this._jsonProjectDataArray.find(x => x.projectPath == path);
            if (search == undefined) {
                let errorToReturn: error = {
                    code: "updateJsonDbProjectDate",
                    message: `desired path ${path} not found`
                }

                vscode.window.showErrorMessage(`${errorToReturn.code} ${errorToReturn.message}`);
                return;
            }

            search.lastOpenedDate = new Date()
            jsonFileLibary.writeFileSync(this._jsonDbPath, this._jsonProjectDataArray, { spaces: 2 })
        }
        catch {
            let errorToReturn: error = {
                code: "updateJsonDbProjectDate",
                message: "failed to update project date in db"
            }

            vscode.window.showErrorMessage(`${errorToReturn.code} ${errorToReturn.message}`);
            return;
        }
    }
}