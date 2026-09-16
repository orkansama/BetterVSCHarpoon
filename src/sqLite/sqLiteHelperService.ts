import * as sqlite from "node:sqlite";
import * as zod from "zod";
import { error } from "../models/error";
import { project } from "../models/project";

export class sqLiteHelperService {
    private readonly _database: sqlite.DatabaseSync;

    constructor(database: sqlite.DatabaseSync) {
        this._database = database;
    };

    public getProjectsFromDatabase(): project[] | error {
        try {
            const query = this._database.prepare(`
                SELECT * FROM projects;
            `);

            const projectSchema: zod.ZodType<project[]> = zod.array(
                zod.object({
                    global_directory_hash: zod.string(),
                    project_path: zod.string(),
                    last_opened: zod.string(),
                })
            );

            const queryReturn = query.all()
            var parsed = projectSchema.parse(queryReturn)

            return parsed;
        }
        catch (e) {
            const error: error = {
                code: "getProjectsFromDatabase",
                message: `an error occured: ${e}`
            };

            return error;
        }
    }

    public doesProjectExistInDatabase(hash: string): boolean | error {
        try {
            const query = this._database.prepare(`
                SELECT EXISTS(
                    SELECT 1 FROM projects WHERE global_directory_hash = '${hash}'
                ) AS found;
            `);

            const projectExists = query.all().at(0) as { found: number };

            if (projectExists.found == 0) {
                return false;
            }

            return true;
        }
        catch (e) {
            const error: error = {
                code: "doesProjectExistInDatabase",
                message: `an error occured: ${e}`
            };

            return error;
        }
    }

    public updateLastOpenedForProject(hash: string, date: string): void | error {
        try {
            this._database.exec(`
                UPDATE projects
                SET last_opened = '${date}'
                WHERE global_directory_hash = '${hash}';
            `);
        }
        catch (e) {
            const error: error = {
                code: "updateLastOpenedForProject",
                message: `an error occured: ${e}`
            };

            return error;
        }
    }

    public addProjectToDatabase(project: project): void | error {
        try {
            this._database.prepare(`
            INSERT INTO projects
            VALUES (
                    ?,
                    ?,
                    ?
                );
            `).all(project.global_directory_hash, project.project_path, project.last_opened);
        }
        catch (e) {
            const error: error = {
                code: "addProjectToDatabase",
                message: `an error occured: ${e}`
            };

            return error;
        }
    }

    public removeProjectFromDatabase(hash: string): void | error {
        try {
            const query = this._database.prepare(`
                    DELETE FROM projects
                    WHERE global_directory_hash='${hash}';
                );
            `);

            query.all()
        }
        catch (e) {
            const error: error = {
                code: "removeProjectFromDatabase",
                message: `an error occured: ${e}`
            };

            return error;
        }
    }

    public removeInvalidRecordsFromDatabase(): void | error {
        try {
            this._database.exec(`
                DELETE FROM projects
                WHERE date(last_opened) < date('now', '-60 days')
            `);
        }
        catch (e) {
            const error: error = {
                code: "removeInvalidRecordsFromDatabase",
                message: `an error occured: ${e}`
            };

            return error;
        }
    }

    public getInvalidRecordsFromDatabase(): string[] | error {
        try {
            const hashes = this._database.prepare(`
                SELECT global_directory_hash FROM projects
                WHERE date(last_opened) < date('now', '-60 days')
            `);

            const queryReturn = hashes.all()
            const stringArraySchema = zod.array(zod.object({ global_directory_hash: zod.string() }));

            const parsedHashes = stringArraySchema.parse(queryReturn).map(r => r.global_directory_hash)

            return parsedHashes;
        }
        catch (e) {
            const error: error = {
                code: "getInvalidRecordsFromDatabase",
                message: `an error occured: ${e}`
            };

            return error;
        }
    }
}