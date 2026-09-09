import dayjs from 'dayjs';
import * as _sut from '../../multiProject/multiProjectService'
import { ExtensionContext } from 'vscode';
import { project } from '../../multiProject/interfaces/project';
import { equal, notEqual } from 'assert';
import { isError } from '../../multiProject/error/error';

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
            {} as ExtensionContext,
            TEST_JSON_DB_PATH,
            [validProject])

        const result = multiProjectService.updateJsonDbProjectDate(validProject.projectPath)
        equal(false, isError(result))
        notEqual(oldDate.getTime(), validProject.lastOpenedDate.getTime())
    });

    test('returns error if path not found', () => {
        let multiProjectService = new _sut.multiProjectService(
            {} as ExtensionContext,
            TEST_JSON_DB_PATH,
            [])

        const result = multiProjectService.updateJsonDbProjectDate("hello/world")
        equal(true, isError(result))
    });

    test('catches and returns error on failure', () => {
        let validProject: project = {
            globalDirectoryHash: "",
            projectPath: "hello/world",
            lastOpenedDate: dayjs().toDate()
        }

        let multiProjectService = new _sut.multiProjectService(
            {} as ExtensionContext,
            {} as string,
            [validProject])

        const result = multiProjectService.updateJsonDbProjectDate(validProject.projectPath)
        equal(true, isError(result))
    });
});
