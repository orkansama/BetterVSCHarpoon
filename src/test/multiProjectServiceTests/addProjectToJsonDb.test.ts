import * as vscode from 'vscode';
import * as _sut from '../../multiProject/multiProjectService'
import { project } from '../../multiProject/interfaces/project';
import dayjs from 'dayjs';
import * as assert from 'assert';
import * as error from '../../multiProject/error/error';

suite('addProjectToJsonDb', () => {
    const TEST_JSON_DB_PATH = "./testJsonDb.json"

    test('adds new project to json db', () => {
        let validProject: project = {
            globalDirectoryHash: "",
            projectPath: "",
            lastOpenedDate: dayjs().toDate()
        }

        let multiProjectService = new _sut.multiProjectService(
            {} as vscode.ExtensionContext,
            TEST_JSON_DB_PATH,
            [validProject])

        var result = multiProjectService.addProjectToJsonDb(validProject)
        assert.equal(false, error.isError(result))
    });

    test('catches and returns error on failure', () => {
        let validProject: project = {
            globalDirectoryHash: "",
            projectPath: "",
            lastOpenedDate: dayjs().toDate()
        }

        let multiProjectService = new _sut.multiProjectService(
            {} as vscode.ExtensionContext,
            {} as string,
            [validProject])

        var result = multiProjectService.addProjectToJsonDb(validProject)
        assert.equal(true, error.isError(result))
    });
});