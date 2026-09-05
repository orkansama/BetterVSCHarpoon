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
	let HARPOON_LIST_PATH: string = String();

	let workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
	if (workspaceRoot == undefined) {
		return;
	}

	const multiProjectDbPath: string = multiProjectService.getMultiProjectDbPath(context);
	multiProjectService.createAndFillJsonDb(multiProjectDbPath);

	var dbContainsPath: boolean = multiProjectService.multiProjectDbIncludesPath(multiProjectDbPath, workspaceRoot);
	if (dbContainsPath) {
		multiProjectService.updateDbProjectDate(multiProjectDbPath, workspaceRoot);

		let projectWithCurrentPath: project | undefined =
			multiProjectService.getProjectByPath(multiProjectDbPath, workspaceRoot)

		if (projectWithCurrentPath == undefined) {
			// projectWithCurrentPath needs rework
			return;
		}

		HARPOON_LIST_PATH = `${GLOBAL_STORAGE_PATH}${path.sep}${projectWithCurrentPath.globalDirectoryHash}${path.sep}better_harpoon_list.txt`
	}
	else {
		const newProject: project = {
			globalDirectoryHash: String(crypto.createHash('sha256')),
			projectPath: workspaceRoot,
			lastOpenedDate: new Date()
		}

		multiProjectService.addObjectToMultiProjectDb(multiProjectDbPath, newProject);

		const newHarpoonList = `${GLOBAL_STORAGE_PATH}${path.sep}${newProject.globalDirectoryHash}${path.sep}better_harpoon_list.txt`;
		fs.mkdirSync(`${newHarpoonList}`, { recursive: true })
		HARPOON_LIST_PATH = `${newHarpoonList}`
	}

	multiProjectService.garbageCollect(GLOBAL_STORAGE_PATH, multiProjectDbPath)

	for (let i = 0; i < 9; i++) {
		const jumpCommand = vscode.commands.registerCommand(
			`bettervscharpoon.navigate_${i + 1}`, () =>
			harpoonJump.registerJumpCommand(i, HARPOON_LIST_PATH));

		context.subscriptions.push(
			jumpCommand
		);
	};

	context.subscriptions.push(
		harpoonAdd.addPathToHarpoonList(HARPOON_LIST_PATH),
		harpoonOpen.openHarpoonFileCommand(HARPOON_LIST_PATH),
	);
}

export function deactivate() { }