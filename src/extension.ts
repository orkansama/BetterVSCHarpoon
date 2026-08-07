import * as fs from 'fs';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "bettervscharpoon" is now active!');

	const addCommand = vscode.commands.registerCommand('bettervscharpoon.add_to_harpoon_list', () => {
		vscode.window.showInformationMessage('Hello World from BetterVSCHarpoon!');

		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
		if (workspaceFolder) {
			const harpoonList = vscode.Uri.joinPath(
				workspaceFolder.uri,
				"better_harpoon_list.txt" // TODO: Change path
			);

			const activeEditor = vscode.window.activeTextEditor;
			if (activeEditor == undefined) {
				return;
			}
			let currentFilePath = activeEditor.document.fileName;

			fs.writeFileSync(harpoonList.fsPath, `${currentFilePath}\n`, {
				encoding: "utf8",
				flag: "a+",
			});
		}
	});

	const jumpCommand = vscode.commands.registerCommand('bettervscharpoon.navigate_1', () => {

		// TODO: Maybe single function?
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
		if (workspaceFolder) {
			const harpoonList = vscode.Uri.joinPath(
				workspaceFolder.uri,
				"better_harpoon_list.txt" // TODO: Change path
			);

			fs.readFile('./Index.html', 'utf8', (err, data) => {
				if (err) throw err;

				const lines = data.split('\n');
				vscode.workspace.openTextDocument(vscode.Uri.file(lines[1]))
			});

			// Question: Wie bekomme ich x path aus der liste
		}
	});

	context.subscriptions.push(addCommand, jumpCommand);
}

export function deactivate() { }