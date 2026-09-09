import dayjs from 'dayjs';
import * as _sut from '../../multiProject/multiProjectService'
import { ExtensionContext } from 'vscode';
import { project } from '../../multiProject/interfaces/project';
import { equal } from 'assert';
import { isError } from '../../multiProject/error/error';

suite('getProjectFromJsonDbByPath', () => {

    test('gets project successfully by the path', () => {
        let validProject: project = {
            globalDirectoryHash: "",
            projectPath: "hello/world",
            lastOpenedDate: dayjs().toDate()
        }

        let multiProjectService = new _sut.multiProjectService(
            {} as ExtensionContext,
            {} as string,
            [validProject])

        const searchedPath = "hello/world"
        const result = multiProjectService.getProjectFromJsonDbByPath(searchedPath)
        equal(validProject, result)
        equal(false, isError(result))
    });

    test('gets project by path and ignores other values', () => {
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
        let projectThree: project = {
            globalDirectoryHash: "",
            projectPath: "hello/world/three",
            lastOpenedDate: dayjs().toDate()
        }

        let multiProjectService = new _sut.multiProjectService(
            {} as ExtensionContext,
            {} as string,
            [projectOne, projectTwo, projectThree])

        const searchedPath = "hello/world"
        const result = multiProjectService.getProjectFromJsonDbByPath(searchedPath)
        equal(projectTwo, result)
        equal(false, isError(result))
    });

    test('returns error on empty path', () => {
        let multiProjectService = new _sut.multiProjectService(
            {} as ExtensionContext,
            {} as string,
            [])

        const searchedPath = "hello/world"
        const result = multiProjectService.getProjectFromJsonDbByPath(searchedPath)
        equal(true, isError(result))
    });

    test('catches and returns error on failure', () => {
        let multiProjectService = new _sut.multiProjectService(
            {} as ExtensionContext,
            {} as string,
            [] as project[])

        const searchedPath = "hello/world";
        const result = multiProjectService.getProjectFromJsonDbByPath(searchedPath);
        equal(true, isError(result))
    });
});