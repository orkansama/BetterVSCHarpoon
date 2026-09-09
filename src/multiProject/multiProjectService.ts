import * as vscode from 'vscode';
import * as fs from "fs";
import * as jsonFileLibary from "jsonfile"
import path from 'path';
import { project } from "./interfaces/project";
import dayjs from "dayjs";
import { error } from "./error/error";

export class multiProjectService {
    private readonly _context: vscode.ExtensionContext;
    private readonly _jsonDbPath: string;
    private _jsonProjectDataArray: project[];

    public constructor(context: vscode.ExtensionContext, jsonDbPath: string, jsonProjectDataArray: project[]) {
        this._context = context
        this._jsonDbPath = jsonDbPath
        this._jsonProjectDataArray = jsonProjectDataArray
    }

    // remove all entrys that are older than 60 days
    public garbageCollectJsonDb(): void | error {
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
            let error: error = {
                code: "garbageCollectJsonDb",
                message: "failed to garbage collect db"
            }

            return error;
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

    public addProjectToJsonDb(projectToAdd: project): void | error {
        try {
            this._jsonProjectDataArray.push(projectToAdd)
            jsonFileLibary.writeFileSync(this._jsonDbPath, this._jsonProjectDataArray, { spaces: 2 })
        }
        catch {
            let error: error = {
                code: "addProjectToJsonDb",
                message: "failed to add project to db"
            }

            return error;
        }
    }

    public getProjectFromJsonDbByPath(path: string): project | error {
        try {
            const searchResult = this._jsonProjectDataArray.find(x => x.projectPath == path);
            if (searchResult == undefined) {
                let error: error = {
                    code: "getProjectFromJsonDbByPath",
                    message: `desired path ${path} not found`
                }

                return error;
            }

            return searchResult;
        }
        catch {
            let error: error = {
                code: "getProjectFromJsonDbByPath",
                message: "failed to get project from db"
            }

            return error;
        }
    }

    public removeProjectFromJsonDb(projectPath: string): void | error {
        try {
            this._jsonProjectDataArray = this._jsonProjectDataArray.filter(item => item.projectPath != projectPath)
            jsonFileLibary.writeFileSync(this._jsonDbPath, this._jsonProjectDataArray, { spaces: 2 })
        }
        catch {
            let error: error = {
                code: "removeProjectFromJsonDb",
                message: "failed to remove project from db"
            }

            return error;
        }
    }

    public jsonDbIncludesPath(path: string): boolean | error {
        try {
            const search = this._jsonProjectDataArray.find(x => x.projectPath == path);
            if (search == undefined) {
                return false
            }

            return true
        }
        catch {
            let error: error = {
                code: "jsonDbIncludesPath",
                message: "failed to check db for project"
            }

            return error;
        }
    }

    public updateJsonDbProjectDate(path: string): void | error {
        try {
            const search = this._jsonProjectDataArray.find(x => x.projectPath == path);
            if (search == undefined) {
                let error: error = {
                    code: "updateJsonDbProjectDate",
                    message: `desired path ${path} not found`
                }

                return error;
            }

            search.lastOpenedDate = new Date()
            jsonFileLibary.writeFileSync(this._jsonDbPath, this._jsonProjectDataArray, { spaces: 2 })
        }
        catch {
            let error: error = {
                code: "updateJsonDbProjectDate",
                message: "failed to update project date in db"
            }

            return error;
        }

    }
}