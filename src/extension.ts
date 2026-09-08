import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';
import * as harpoonAdd from "./harpoonAdd"
import * as harpoonJump from "./harpoonJump"
import * as harpoonOpen from "./harpoonOpen"
import * as multiProjectService from "./multiProject/multiProjectService"
import { project } from './multiProject/interfaces/project';
import * as crypto from 'crypto';

export function activate(context: vscode.ExtensionContext) {
	const GLOBAL_STORAGE_PATH: string = context.globalStorageUri.fsPath;
	let harpoonListPath: string = String();
	let internalErrorMessage: string = "BetterVSCHarpoon internal error"

	let workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
	if (workspaceRoot == undefined) {
		return vscode.window.showErrorMessage(internalErrorMessage)
	}

	const jsonDbPath = multiProjectService.getJsonDbPath(context);
	if (jsonDbPath == undefined) {
		return vscode.window.showErrorMessage(internalErrorMessage)
	}

	// save
	var jsonDbContainsPath = multiProjectService.jsonDbIncludesPath(jsonDbPath, workspaceRoot);
	if (jsonDbContainsPath == undefined) {
		return vscode.window.showErrorMessage(internalErrorMessage)
	}
	else if (jsonDbContainsPath) {
		multiProjectService.updateJsonDbProjectDate(jsonDbPath, workspaceRoot);

		let projectWithCurrentPath = multiProjectService.getProjectFromJsonDbByPath(jsonDbPath, workspaceRoot)
		if (projectWithCurrentPath == undefined) {
			return vscode.window.showErrorMessage(internalErrorMessage)
		}

		harpoonListPath = `${GLOBAL_STORAGE_PATH}${path.sep}${projectWithCurrentPath.globalDirectoryHash}${path.sep}better_harpoon_list.txt`
	}
	else {
		const newProject: project = {
			globalDirectoryHash: crypto
				.createHash('sha256')
				.update(workspaceRoot)
				.digest('hex')
				.toString(),
			projectPath: workspaceRoot,
			lastOpenedDate: new Date()
		}

		multiProjectService.addProjectToJsonDb(jsonDbPath, newProject);

		const harpoonListHashDirectory = `${GLOBAL_STORAGE_PATH}${path.sep}${newProject.globalDirectoryHash}`;
		const fullHarpoonListPath = `${harpoonListHashDirectory}${path.sep}better_harpoon_list.txt`;
		try {
			fs.mkdirSync(`${harpoonListHashDirectory}`, { recursive: true })
			let file = fs.openSync(fullHarpoonListPath, 'a')
			fs.closeSync(file)
		}
		catch {
			return vscode.window.showErrorMessage(internalErrorMessage)
		}

		harpoonListPath = `${fullHarpoonListPath}`
	}

	// remove
	try {
		multiProjectService.garbageCollectJsonDb(GLOBAL_STORAGE_PATH, jsonDbPath)
	} catch {
		return vscode.window.showErrorMessage(internalErrorMessage)
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