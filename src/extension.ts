import * as fs from 'fs';
import * as vscode from 'vscode';
import { sep } from 'path';
import { addPathToHarpoonList } from "./harpoonAdd"
import { registerJumpCommand } from "./harpoonJump"
import { openHarpoonFileCommand } from "./harpoonOpen"
import { createHash } from 'crypto';
import { project } from './multiProject/interfaces/project';
import { multiProjectServiceFactory } from './multiProject/multiProjectServiceFactory';
import { isError } from "./multiProject/error/error";

export function activate(context: vscode.ExtensionContext) {
	const GLOBAL_STORAGE_PATH: string = context.globalStorageUri.fsPath;
	let harpoonListPath: string = String();
	let internalErrorMessage: string = "BetterVSCHarpoon: internal error"

	const dbService = multiProjectServiceFactory.createMultiProjectService(context);
	if (isError(dbService)) {
		vscode.window.showErrorMessage(`${dbService.code} ${dbService.message}`);
		return;
	}
	else {
		const disableRelativeFilePath: boolean = vscode.workspace
			.getConfiguration("BetterVSCHarpoon")
			.get<boolean>("DisableRelativeFilePath", false);

		// save
		let workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
		// We dont care about the workspace root if we navigate with full paths
		if (!disableRelativeFilePath) {
			if (workspaceRoot == undefined) {
				vscode.window.showErrorMessage("BetterVSCHarpoon: No Workspace root. You can disable relative path navigation in the plugin settings")
				return;
			}
		}

		const jsonDbContainsPath = dbService.jsonDbIncludesPath(workspaceRoot!);
		if (isError(jsonDbContainsPath)) {
			vscode.window.showErrorMessage(`${jsonDbContainsPath.code} ${jsonDbContainsPath.message}`);
			return;
		}

		if (jsonDbContainsPath) {
			dbService.updateJsonDbProjectDate(workspaceRoot!);

			let projectWithCurrentPath = dbService.getProjectFromJsonDbByPath(workspaceRoot!)
			if (isError(projectWithCurrentPath)) {
				vscode.window.showErrorMessage(`${projectWithCurrentPath.code} ${projectWithCurrentPath.message}`);
				return;
			}
			else {
				harpoonListPath = `${GLOBAL_STORAGE_PATH}${sep}${projectWithCurrentPath.globalDirectoryHash}${sep}better_harpoon_list.txt`
			}
		}
		else {
			const newProject: project = {
				globalDirectoryHash: createHash('sha256')
					.update(workspaceRoot!)
					.digest('hex')
					.toString(),
				projectPath: workspaceRoot!,
				lastOpenedDate: new Date()
			}

			let addToDb = dbService.addProjectToJsonDb(newProject);
			if (isError(addToDb)) {
				vscode.window.showErrorMessage(`${addToDb.code} ${addToDb.message}`);
				return;
			}

			const harpoonListHashDirectory = `${GLOBAL_STORAGE_PATH}${sep}${newProject.globalDirectoryHash}`;
			const fullHarpoonListPath = `${harpoonListHashDirectory}${sep}better_harpoon_list.txt`;
			try {
				fs.mkdirSync(`${harpoonListHashDirectory}`, { recursive: true })
				let file = fs.openSync(fullHarpoonListPath, 'a')
				fs.closeSync(file)
			}
			catch {
				vscode.window.showErrorMessage(internalErrorMessage)
				return;
			}

			harpoonListPath = `${fullHarpoonListPath}`
		}

		// remove
		try {
			const garbageCollect = dbService.garbageCollectJsonDb()
			if (isError(garbageCollect)) {
				vscode.window.showErrorMessage(`${garbageCollect.code} ${garbageCollect.message}`);
				return;
			}
		} catch {
			vscode.window.showErrorMessage(internalErrorMessage)
			return;
		}

		for (let i = 0; i < 9; i++) {
			const jumpCommand = vscode.commands.registerCommand(
				`bettervscharpoon.navigate_${i + 1}`, () =>
				registerJumpCommand(i, harpoonListPath));

			context.subscriptions.push(
				jumpCommand
			);
		};

		context.subscriptions.push(
			addPathToHarpoonList(harpoonListPath),
			openHarpoonFileCommand(harpoonListPath),
		);
	}
}


export function deactivate() { }