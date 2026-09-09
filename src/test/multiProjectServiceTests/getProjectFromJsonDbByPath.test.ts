import * as vscode from 'vscode';
import * as _sut from '../../multiProject/multiProjectService'
import { project } from '../../multiProject/interfaces/project';
import dayjs from 'dayjs';
import * as assert from 'assert';
import * as error from '../../multiProject/error/error';

suite('getProjectFromJsonDbByPath', () => {

    test('gets project successfully by the path', () => {
        let validProject: project = {
            globalDirectoryHash: "",
            projectPath: "hello/world",
            lastOpenedDate: dayjs().toDate()
        }

        let multiProjectService = new _sut.multiProjectService(
            {} as vscode.ExtensionContext,
            {} as string,
            [validProject])

        const searchedPath = "hello/world"
        const result = multiProjectService.getProjectFromJsonDbByPath(searchedPath)
        assert.equal(validProject, result)
        assert.equal(false, error.isError(result))
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
            {} as vscode.ExtensionContext,
            {} as string,
            [projectOne, projectTwo, projectThree])

        const searchedPath = "hello/world"
        const result = multiProjectService.getProjectFromJsonDbByPath(searchedPath)
        assert.equal(projectTwo, result)
        assert.equal(false, error.isError(result))
    });

    test('returns error on empty path', () => {
        let multiProjectService = new _sut.multiProjectService(
            {} as vscode.ExtensionContext,
            {} as string,
            [])

        const searchedPath = "hello/world"
        const result = multiProjectService.getProjectFromJsonDbByPath(searchedPath)
        assert.equal(true, error.isError(result))
    });

    test('catches and returns error on failure', () => {
        let multiProjectService = new _sut.multiProjectService(
            {} as vscode.ExtensionContext,
            {} as string,
            [] as project[])

        const searchedPath = "hello/world";
        const result = multiProjectService.getProjectFromJsonDbByPath(searchedPath);
        assert.equal(true, error.isError(result))
    });
});