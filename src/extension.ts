import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';
import * as harpoonAdd from "./harpoonAdd"
import * as harpoonJump from "./harpoonJump"
import * as harpoonOpen from "./harpoonOpen"

export function activate(context: vscode.ExtensionContext) {
	const harpoonListDirectory: string = context.globalStorageUri.fsPath;
	const harpoonListPath: string = `${harpoonListDirectory}${path.sep}better_harpoon_list.txt`;
	fs.mkdir(harpoonListDirectory, { recursive: true }, (err) => {
		if (err) throw err;

		fs.open(harpoonListPath, 'a', (err) => {
			if (err) throw err;
		})
	});

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