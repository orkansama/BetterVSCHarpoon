import * as vscode from 'vscode';
import * as _sut from '../../multiProject/multiProjectService'
import { project } from '../../multiProject/interfaces/project';
import dayjs from 'dayjs';
import * as assert from 'assert';
import * as error from '../../multiProject/error/error';

suite('removeProjectFromJsonDb', () => {
    const TEST_JSON_DB_PATH = "./testJsonDb.json"

    test('removes project from json db', () => {
        let projectToRemove: project = {
            globalDirectoryHash: "",
            projectPath: "hello/world",
            lastOpenedDate: dayjs().toDate()
        }

        let multiProjectService = new _sut.multiProjectService(
            {} as vscode.ExtensionContext,
            TEST_JSON_DB_PATH,
            [projectToRemove])

        const result = multiProjectService.removeProjectFromJsonDb(projectToRemove.projectPath)
        assert.equal(false, error.isError(result))
        assert.equal(false, multiProjectService.jsonDbIncludesPath(projectToRemove.projectPath))
    });

    test('removes project by path and ignores other projects', () => {
        let projectOne: project = {
            globalDirectoryHash: "",
            projectPath: "hello/world/one",
            lastOpenedDate: dayjs().toDate()
        }
        let projectTwo: project = {
            globalDirectoryHash: "",
            projectPath: "hello/world",
            lastOpenedDate: dayjs().toDate()
        }

        let multiProjectService = new _sut.multiProjectService(
            {} as vscode.ExtensionContext,
            TEST_JSON_DB_PATH,
            [projectOne, projectTwo])

        const result = multiProjectService.removeProjectFromJsonDb(projectTwo.projectPath)
        assert.equal(false, error.isError(result))
        assert.equal(true, multiProjectService.jsonDbIncludesPath(projectOne.projectPath))
        assert.equal(false, multiProjectService.jsonDbIncludesPath(projectTwo.projectPath))
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

        const result = multiProjectService.removeProjectFromJsonDb(validProject.projectPath)
        assert.equal(true, error.isError(result))
    });
});
