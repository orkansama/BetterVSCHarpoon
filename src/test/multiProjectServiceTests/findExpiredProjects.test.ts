import dayjs from 'dayjs';
import * as _sut from '../../multiProject/multiProjectService'
import { ExtensionContext } from 'vscode';
import { project } from '../../multiProject/interfaces/project';
import { equal } from 'assert';

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
			{} as ExtensionContext,
			{} as string,
			[expiredProject, validProject])

		const result = multiProjectService.findExpiredProjects()

		equal(result.length, 1)
		equal(result[0], expiredProject)
	});

	test('returns empty array, if no invalid projects found', () => {
		let validProject: project = {
			globalDirectoryHash: "",
			projectPath: "",
			lastOpenedDate: dayjs().toDate()
		}

		let multiProjectService = new _sut.multiProjectService(
			{} as ExtensionContext,
			{} as string,
			[validProject])

		const result = multiProjectService.findExpiredProjects()

		equal(result.length, 0)
	});
});