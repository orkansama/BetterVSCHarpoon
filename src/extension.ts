import * as fs from 'fs';
import * as vscode from 'vscode';

export function getHarpoonListPath(): string | undefined {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	if (!workspaceFolder) {
		vscode.window.showInformationMessage('Harpoon List Error!');
		return undefined;
	};

	const harpoonList = vscode.Uri.joinPath(
		workspaceFolder.uri,
		"better_harpoon_list.txt");

	return harpoonList.fsPath;
}

function registerJumpCommand(indexToRegister: number): any {
	const harpoonListPath = getHarpoonListPath();
	if (harpoonListPath == undefined) {
		return;
	}

	fs.readFile(harpoonListPath, 'utf8', async (err, data) => {
		if (err) {
			return;
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
	const addHarpoonFileCommand = vscode.commands.registerCommand('bettervscharpoon.add_to_harpoon_list', () => {
		const harpoonListPath = getHarpoonListPath();
		if (harpoonListPath == undefined) {
			return;
		}

		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor == undefined) {
			return;
		}
		let currentFilePath = activeEditor.document.fileName;

		fs.writeFileSync(harpoonListPath, `${currentFilePath}\n`, {
			encoding: "utf8",
			flag: "a+",
		});
	});

	const openHarpoonFileCommand = vscode.commands.registerCommand('bettervscharpoon.open_harpoon_list', async () => {
		const harpoonListPath = getHarpoonListPath();
		if (harpoonListPath == undefined) {
			return;
		}

		try {
			const harpoonFile = await vscode.workspace.openTextDocument(harpoonListPath);
			vscode.window.showTextDocument(harpoonFile, vscode.ViewColumn.One, false);
		}
		catch {
			vscode.window.showErrorMessage("Could not open Harpoon list!");
		}
	});

	for (let i = 0; i < 9; i++) {
		const jumpCommand = vscode.commands.registerCommand(`bettervscharpoon.navigate_${i + 1}`, () => registerJumpCommand(i));

		context.subscriptions.push(
			addHarpoonFileCommand,
			openHarpoonFileCommand,
			jumpCommand
		);
	};
}

export function deactivate() { }