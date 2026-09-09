import dayjs from 'dayjs';
import * as _sut from '../../multiProject/multiProjectService'
import { ExtensionContext } from 'vscode';
import { project } from '../../multiProject/interfaces/project';
import { equal } from 'assert';
import { isError } from '../../multiProject/error/error';

suite('addProjectToJsonDb', () => {
    const TEST_JSON_DB_PATH = "./testJsonDb.json"

    test('adds new project to json db', () => {
        let validProject: project = {
            globalDirectoryHash: "",
            projectPath: "",
            lastOpenedDate: dayjs().toDate()
        }

        let multiProjectService = new _sut.multiProjectService(
            {} as ExtensionContext,
            TEST_JSON_DB_PATH,
            [validProject])

        const result = multiProjectService.addProjectToJsonDb(validProject)
        equal(false, isError(result))
    });

    test('catches and returns error on failure', () => {
        let validProject: project = {
            globalDirectoryHash: "",
            projectPath: "",
            lastOpenedDate: dayjs().toDate()
        }

        let multiProjectService = new _sut.multiProjectService(
            {} as ExtensionContext,
            {} as string,
            [validProject])

        const result = multiProjectService.addProjectToJsonDb(validProject)
        equal(true, isError(result))
    });
});