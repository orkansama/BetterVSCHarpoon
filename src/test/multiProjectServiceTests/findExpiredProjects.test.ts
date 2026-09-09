import * as vscode from 'vscode';
import * as _sut from '../../multiProject/multiProjectService'
import { project } from '../../multiProject/interfaces/project';
import dayjs from 'dayjs';
import * as assert from 'assert';

suite('findExpiredProjects', () => {
	test('only finds expired projects', () => {
		let expiredProject: project = {
			globalDirectoryHash: "",
			projectPath: "",
			lastOpenedDate: dayjs().subtract(80, "days").toDate(),
		}

		let validProject: project = {
			globalDirectoryHash: "",
			projectPath: "",
			lastOpenedDate: dayjs().toDate()
		}

		let multiProjectService = new _sut.multiProjectService(
			{} as vscode.ExtensionContext,
			{} as string,
			[expiredProject, validProject])

		const result = multiProjectService.findExpiredProjects()

		assert.equal(result.length, 1)
		assert.equal(result[0], expiredProject)
	});

	test('returns empty array, if no invalid projects found', () => {
		let validProject: project = {
			globalDirectoryHash: "",
			projectPath: "",
			lastOpenedDate: dayjs().toDate()
		}

		let multiProjectService = new _sut.multiProjectService(
			{} as vscode.ExtensionContext,
			{} as string,
			[validProject])

		const result = multiProjectService.findExpiredProjects()

		assert.equal(result.length, 0)
	});
});