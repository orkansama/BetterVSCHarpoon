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

	const jumpCommandOne = vscode.commands.registerCommand('bettervscharpoon.navigate_1', () => {
		// TODO: Maybe single function?
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
		if (workspaceFolder) {
			const harpoonList = vscode.Uri.joinPath(
				workspaceFolder.uri,
				"better_harpoon_list.txt" // TODO: Change path
			);

			fs.readFile(harpoonList.fsPath, 'utf8', async(err, data) => {
				if (err) throw err;

				const lines = data.split('\n');
				const document = await vscode.workspace.openTextDocument(lines[0]);
				vscode.window.showTextDocument(document, vscode.ViewColumn.One, false);
			});
		}
	});

	const jumpCommandSecond = vscode.commands.registerCommand('bettervscharpoon.navigate_2', () => {
		// TODO: Maybe single function?
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
		if (workspaceFolder) {
			const harpoonList = vscode.Uri.joinPath(
				workspaceFolder.uri,
				"better_harpoon_list.txt" // TODO: Change path
			);

			fs.readFile(harpoonList.fsPath, 'utf8', async(err, data) => {
				if (err) throw err;

				const lines = data.split('\n');
				const document = await vscode.workspace.openTextDocument(lines[1]);
				vscode.window.showTextDocument(document, vscode.ViewColumn.One, false);
			});
		}
	});

	context.subscriptions.push(addCommand, jumpCommandOne, jumpCommandSecond);
}

export function deactivate() { }