import dayjs from 'dayjs';
import * as _sut from '../../multiProject/multiProjectService'
import { ExtensionContext } from 'vscode';
import { project } from '../../multiProject/interfaces/project';
import { equal } from 'assert';
import { isError } from '../../multiProject/error/error';

suite('jsonDbIncludesPath', () => {

    test('returns true if path exists in db', () => {
        let validProject: project = {
            globalDirectoryHash: "",
            projectPath: "hello/world",
            lastOpenedDate: dayjs().toDate()
        }

        let multiProjectService = new _sut.multiProjectService(
            {} as ExtensionContext,
            {} as string,
            [validProject])

        const result = multiProjectService.jsonDbIncludesPath("hello/world")
        equal(true, result)
        equal(false, isError(result))
    });

    test('returns false if path does not exist in db', () => {
        let validProject: project = {
            globalDirectoryHash: "",
            projectPath: "hello/world",
            lastOpenedDate: dayjs().toDate()
        }

        let multiProjectService = new _sut.multiProjectService(
            {} as ExtensionContext,
            {} as string,
            [validProject])

        const result = multiProjectService.jsonDbIncludesPath("hello/other")
        equal(false, result)
        equal(false, isError(result))
    });

    test('catches and returns error on failure', () => {
        let multiProjectService = new _sut.multiProjectService(
            {} as ExtensionContext,
            {} as string,
            undefined as unknown as project[])

        const result = multiProjectService.jsonDbIncludesPath("hello/world")
        equal(true, isError(result))
    });
});
