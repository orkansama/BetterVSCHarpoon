import * as fs from 'fs';
import path from 'path';
import * as vscode from 'vscode';

export function registerJumpCommand(indexToRegister: number, harpoonListPath: string) {
	fs.readFile(harpoonListPath, 'utf8', async (err, data) => {
		if (err) {
			vscode.window.showErrorMessage("Could not read harpoon list");
			return;
		}

		const lines = data.split('\n');

		if (path.isAbsolute(lines[indexToRegister])) {
			let documentWithFullPath: vscode.TextDocument = await vscode.workspace.openTextDocument(lines[indexToRegister].trim());

			jump(documentWithFullPath);
		}
		else {
			let workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
			if (workspaceRoot == undefined) {
				vscode.window.showErrorMessage("Incorrect workspace root, relative paths can be disabled in Harpoon settings");
				return;
			}

			let resolvedRelativePath = path.resolve(workspaceRoot.toString(), lines[indexToRegister].trim())
			let documentWithRelativePath: vscode.TextDocument = await vscode.workspace.openTextDocument(resolvedRelativePath);

			jump(documentWithRelativePath);
		}
	});
};

function jump(documentToShow: vscode.TextDocument) {
	if (documentToShow.isUntitled) {
		return;
	}

	vscode.window.showTextDocument(documentToShow, vscode.ViewColumn.One, false);
}