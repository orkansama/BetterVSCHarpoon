import * as sqlite from "node:sqlite";
import { error } from "../models/error";

export class sqLiteHelperServiceFactory {
    private readonly _dbPath: string;

    constructor(dbPath: string) {
        this._dbPath = dbPath
    }

    public createDatabase(): sqlite.DatabaseSync | error {
        try {
            const db = new sqlite.DatabaseSync(this._dbPath);
            db.exec(`
                CREATE TABLE IF NOT EXISTS projects(
                    global_directory_hash TEXT PRIMARY KEY,
                    project_path TEXT,
                    last_opened TEXT
                ) STRICT
            `);
            return db;
        }
        catch (e) {
            const error: error = {
                code: "createDatabase",
                message: `an error occured: ${e}`
            };

            return error;
        }
    }
}