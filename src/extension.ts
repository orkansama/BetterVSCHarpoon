import * as vscode from 'vscode';
import * as path from 'path';
import * as sqLiteFactory from "./sqLite/sqLiteHelperServiceFactory"
import * as sqLiteHelper from './sqLite/sqLiteHelperService';
import * as harpoonAdd from "./harpoonAdd"
import * as harpoonJump from "./harpoonJump"
import * as harpoonOpen from "./harpoonOpen"
import * as error from "./models/error"
import { createHash } from 'crypto';
import { project } from './models/project';
import dayjs from 'dayjs';
import { createFile, removeDirectoryArrayRecursive } from './filesystem/fsService';
import zod from 'zod';
import { mkdirSync } from 'fs';

export function activate(context: vscode.ExtensionContext) {
	const globalStoragePath: string = context.globalStorageUri.fsPath;
	mkdirSync(globalStoragePath, { recursive: true })

	const databasePath: string = `${globalStoragePath}${path.sep}better_harpoon.db`;
	let harpoonListPath: string;

	const workspaceFolderPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath

	const useGlobalList: boolean = vscode.workspace
		.getConfiguration("BetterVSCHarpoon")
		.get<boolean>("UseGlobalList", false);

	if (workspaceFolderPath == undefined || useGlobalList) {
		const globalHarpoonListPath: string = `${globalStoragePath}${path.sep}better_harpoon_list.txt`;

		const create = createFile(globalStoragePath, globalHarpoonListPath)
		if (error.isError(create)) {
			vscode.window.showErrorMessage(`${create.code} ${create.message}`)
			return;
		}

		harpoonListPath = globalHarpoonListPath;
	}
	else {
		const databaseFactory = new sqLiteFactory.sqLiteHelperServiceFactory(databasePath)
		const database = databaseFactory.createDatabase()
		if (error.isError(database)) {
			vscode.window.showErrorMessage(`${database.code} ${database.message}`)
			return;
		}

		const databaseHelper = new sqLiteHelper.sqLiteHelperService(database)
		if (error.isError(databaseHelper)) {
			vscode.window.showErrorMessage(`${databaseHelper.code} ${databaseHelper.message}`)
			return;
		}

		const workspaceFolderPathHash: string = createHash('sha256')
			.update(workspaceFolderPath)
			.digest('hex')
			.toString();
		const dateTimeToday: string = dayjs().format("YYYY-MM-DD").toString();

		const hashedProjectDirectory: string = `${globalStoragePath}${path.sep}${workspaceFolderPathHash}`;
		const hashedProjectHarpoonFile: string = `${globalStoragePath}${path.sep}${workspaceFolderPathHash}${path.sep}better_harpoon_list.txt`;

		const databaseContainsCurrentFilePathHash = databaseHelper.doesProjectExistInDatabase(workspaceFolderPathHash);
		if (error.isError(databaseContainsCurrentFilePathHash)) {
			vscode.window.showErrorMessage(`${databaseContainsCurrentFilePathHash.code} ${databaseContainsCurrentFilePathHash.message}`)
			return;
		}
		if (databaseContainsCurrentFilePathHash) {
			const updateLastOpened = databaseHelper.updateLastOpenedForProject(workspaceFolderPathHash, dateTimeToday)
			if (error.isError(updateLastOpened)) {
				vscode.window.showErrorMessage(`${updateLastOpened.code} ${updateLastOpened.message}`)
				return;
			}
		}
		else {
			const newProject: project = {
				global_directory_hash: workspaceFolderPathHash,
				project_path: workspaceFolderPath,
				last_opened: dateTimeToday
			}

			try {
				const addProject = databaseHelper.addProjectToDatabase(newProject)
				if (error.isError(addProject)) {
					const error: error.error = {
						code: addProject.code,
						message: addProject.message
					};

					throw error;
				}

				const create = createFile(hashedProjectDirectory, hashedProjectHarpoonFile)
				if (error.isError(create)) {
					const error: error.error = {
						code: create.code,
						message: create.message
					};

					throw error;
				}
			}
			catch (e) {
				const errorSchema: zod.ZodType<error.error> = zod.object({
					code: zod.string(),
					message: zod.string(),
				});

				const parsedException = errorSchema.parse(e)

				vscode.window.showErrorMessage(`${parsedException.code} ${parsedException.message}`)
				return;
			}
		}

		try {
			const invalidProjectHashes = databaseHelper.getInvalidRecordsFromDatabase()
			if (error.isError(invalidProjectHashes)) {
				const error: error.error = {
					code: invalidProjectHashes.code,
					message: invalidProjectHashes.message
				};

				throw error;
			}

			const removeDirectorys = removeDirectoryArrayRecursive(globalStoragePath, invalidProjectHashes)
			if (error.isError(removeDirectorys)) {
				const error: error.error = {
					code: removeDirectorys.code,
					message: removeDirectorys.message
				};

				throw error;
			}

			const removeRecord = databaseHelper.removeInvalidRecordsFromDatabase()
			if (error.isError(removeRecord)) {
				const error: error.error = {
					code: removeRecord.code,
					message: removeRecord.message
				};

				throw error;
			}

		}
		catch (e) {
			const errorSchema: zod.ZodType<error.error> = zod.object({
				code: zod.string(),
				message: zod.string(),
			});

			const parsedException = errorSchema.parse(e)

			vscode.window.showErrorMessage(`${parsedException.code} ${parsedException.message}`)
		}

		harpoonListPath = hashedProjectHarpoonFile;
		database.close()
	}


	for (let i = 0; i < 9; i++) {
		const jumpCommand = vscode.commands.registerCommand(
			`bettervscharpoon.navigate_${i + 1}`, () =>
			harpoonJump.registerJumpCommand(i, harpoonListPath));

		context.subscriptions.push(
			jumpCommand
		);
	};

	context.subscriptions.push(
		harpoonAdd.addPathToHarpoonList(harpoonListPath),
		harpoonOpen.openHarpoonFileCommand(harpoonListPath),
	);
}

export function deactivate() { }