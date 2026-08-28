import * as fs from 'fs';
import * as vscode from 'vscode';

export function addPathToHarpoonList(harpoonListPath: string): vscode.Disposable {
    const addHarpoonPathToHarpoonFile = vscode.commands.registerCommand('bettervscharpoon.add_to_harpoon_list', () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor == undefined) {
            return;
        }

        let fullFilePath = activeEditor.document.fileName;
        let relativePath = vscode.workspace.asRelativePath(fullFilePath);

        const disableRelativeFilePath: boolean = vscode.workspace
            .getConfiguration("BetterVSCHarpoon")
            .get<boolean>("DisableRelativeFilePath", false);

        if (disableRelativeFilePath) {
            fs.readFile(harpoonListPath, 'utf8', async (err, data) => {
                if (err) {
                    vscode.window.showErrorMessage("Could not read harpoon list");
                    return;
                }

                const lines = data.split('\n');
                const lineIsHarpoonPath: boolean = fullFilePath == harpoonListPath;
                let fullPathIsAlreadyInHarpoonFile = lines.includes(fullFilePath);

                if (fullPathIsAlreadyInHarpoonFile || lineIsHarpoonPath) {
                    return;
                }
                else {
                    addPath(fullFilePath, harpoonListPath)
                }
            });
        }
        else {
            fs.readFile(harpoonListPath, 'utf8', async (err, data) => {
                if (err) {
                    vscode.window.showErrorMessage("Could not read harpoon list");
                    return;
                }

                const lines = data.split('\n');
                const lineIsHarpoonPath: boolean = relativePath == harpoonListPath;
                let relativePathIsAlreadyInHarpoonFile: boolean = lines.includes(relativePath)

                if (relativePathIsAlreadyInHarpoonFile || lineIsHarpoonPath) {
                    return;
                }
                else {
                    addPath(relativePath, harpoonListPath)
                }
            });
        }
    });

    return addHarpoonPathToHarpoonFile;
}

export function addPath(path: string, harpoonListPath: string) {
    fs.writeFileSync(harpoonListPath, `${path}\n`, {
        encoding: "utf8",
        flag: "a+",
    });

}