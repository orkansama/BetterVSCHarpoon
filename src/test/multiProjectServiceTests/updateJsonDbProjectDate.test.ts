import * as vscode from 'vscode';
import * as _sut from '../../multiProject/multiProjectService'
import { project } from '../../multiProject/interfaces/project';
import dayjs from 'dayjs';
import * as assert from 'assert';
import * as error from '../../multiProject/error/error';

suite('updateJsonDbProjectDate', () => {
    const TEST_JSON_DB_PATH = "./testJsonDb.json"

    test('updates project date successfully', () => {
        let oldDate = dayjs().subtract(10, "days").toDate()
        let validProject: project = {
            globalDirectoryHash: "",
            projectPath: "hello/world",
            lastOpenedDate: oldDate
        }

        let multiProjectService = new _sut.multiProjectService(
            {} as vscode.ExtensionContext,
            TEST_JSON_DB_PATH,
            [validProject])

        const result = multiProjectService.updateJsonDbProjectDate(validProject.projectPath)
        assert.equal(false, error.isError(result))
        assert.notEqual(oldDate.getTime(), validProject.lastOpenedDate.getTime())
    });

    test('returns error if path not found', () => {
        let multiProjectService = new _sut.multiProjectService(
            {} as vscode.ExtensionContext,
            TEST_JSON_DB_PATH,
            [])

        const result = multiProjectService.updateJsonDbProjectDate("hello/world")
        assert.equal(true, error.isError(result))
    });

    test('catches and returns error on failure', () => {
        let validProject: project = {
            globalDirectoryHash: "",
            projectPath: "hello/world",
            lastOpenedDate: dayjs().toDate()
        }

        let multiProjectService = new _sut.multiProjectService(
            {} as vscode.ExtensionContext,
            {} as string,
            [validProject])

        const result = multiProjectService.updateJsonDbProjectDate(validProject.projectPath)
        assert.equal(true, error.isError(result))
    });
});
