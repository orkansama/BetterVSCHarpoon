import * as vscode from 'vscode';

export function openHarpoonFileCommand(harpoonListPath: string): vscode.Disposable {
    let openHarpoonFileCommand = vscode.commands.registerCommand('bettervscharpoon.open_harpoon_list', async () => {
        try {
            const harpoonFile = await vscode.workspace.openTextDocument(harpoonListPath);
            vscode.window.showTextDocument(harpoonFile, vscode.ViewColumn.Active, false);
            return openHarpoonFileCommand;
        }
        catch {
            vscode.window.showErrorMessage("Could not open Harpoon list!");
        }
    });

    return openHarpoonFileCommand;
}