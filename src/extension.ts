import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';

function registerJumpCommand(indexToRegister: number, harpoonListPath: string): any {
	fs.readFile(harpoonListPath, 'utf8', async (err, data) => {
		if (err) {
			vscode.window.showErrorMessage("Could not read harpoon list");
		}

		const lines = data.split('\n');
		try {

			const document = await vscode.workspace.openTextDocument(lines[indexToRegister]);
			vscode.window.showTextDocument(document, vscode.ViewColumn.One, false);
		}
		catch {
			vscode.window.showErrorMessage("Could not open the requested file!");
		}
	});
};

export function activate(context: vscode.ExtensionContext) {
	vscode.workspace.fs.createDirectory(context.globalStorageUri);
	const harpoonListPath = `${context.globalStorageUri.fsPath}${path.sep}better_harpoon_list.txt`;

	const addHarpoonFileCommand = vscode.commands.registerCommand('bettervscharpoon.add_to_harpoon_list', () => {
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor == undefined) {
			return;
		}

		let currentFilePath = activeEditor.document.fileName;

		fs.readFile(harpoonListPath, 'utf8', async (err, data) => {
			if (err) {
				vscode.window.showErrorMessage("Could not read harpoon list");
			}

			const lines = data.split('\n');
			const lineIsHarpoonPath: boolean = currentFilePath == harpoonListPath;
			if (lines.includes(currentFilePath) || lineIsHarpoonPath) {
				return;
			}
			else {
				fs.writeFileSync(harpoonListPath, `${currentFilePath}\n`, {
					encoding: "utf8",
					flag: "a+",
				});
			}
		});
	});

	const openHarpoonFileCommand = vscode.commands.registerCommand('bettervscharpoon.open_harpoon_list', async () => {
		try {
			const harpoonFile = await vscode.workspace.openTextDocument(harpoonListPath);
			vscode.window.showTextDocument(harpoonFile, vscode.ViewColumn.One, false);
		}
		catch {
			vscode.window.showErrorMessage("Could not open Harpoon list!");
		}
	});

	for (let i = 0; i < 9; i++) {
		const jumpCommand = vscode.commands.registerCommand(`bettervscharpoon.navigate_${i + 1}`, () => registerJumpCommand(i, harpoonListPath));

		context.subscriptions.push(
			addHarpoonFileCommand,
			openHarpoonFileCommand,
			jumpCommand
		);
	};
}

export function deactivate() { }