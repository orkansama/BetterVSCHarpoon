import * as assert from 'assert';
import * as vscode from 'vscode';
import * as _sut from '../multiProject/multiProjectService'
import * as fs from "fs";
import * as sinon from "sinon";

suite('multiProjectService tests', () => {
	const TEST_DB_PATH: string = "./testDb.json";
	const GLOBAL_STORARGE_PATh: string = "./globalStorage/harpoon_list_test.txt";

	beforeEach(() => {
		fs.writeFileSync(TEST_DB_PATH, '[]');

	});

	afterEach(() => {
		if (fs.existsSync(TEST_DB_PATH)) {
			fs.rmSync(TEST_DB_PATH);
		}
	});

	test('getJsonDbPath: returns JsonDbPath', () => {
	});
});
