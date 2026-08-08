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
		"better_harpoon_list.txt") // TODO: Change path

	return harpoonList.fsPath;
}

export function activate(context: vscode.ExtensionContext) {
	const addCommand = vscode.commands.registerCommand('bettervscharpoon.add_to_harpoon_list', () => {
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

	function registerJumpCommand(indexToRegister: number): any {
		const harpoonListPath = getHarpoonListPath();
		if (harpoonListPath == undefined) {
			return;
		}

		fs.readFile(harpoonListPath, 'utf8', async (err, data) => {
			if (err) throw err;

			const lines = data.split('\n');
			const document = await vscode.workspace.openTextDocument(lines[indexToRegister]);
			vscode.window.showTextDocument(document, vscode.ViewColumn.One, false);
		});
	};

	for (let i = 0; i < 9; i++) {
		const jumpCommand = vscode.commands.registerCommand(`bettervscharpoon.navigate_${i + 1}`, () => registerJumpCommand(i));

		context.subscriptions.push(
			addCommand,
			jumpCommand
		);
	};
}

export function deactivate() { }