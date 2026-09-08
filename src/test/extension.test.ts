import * as assert from 'assert';
import * as vscode from 'vscode';
import * as _sut from '../multiProject/multiProjectService'
import * as fs from "fs";

suite('multiProjectService tests', () => {
	const TEST_DB_PATH: string = "./testDb.json";

	beforeEach(() => {
		fs.writeFileSync(TEST_DB_PATH, '[]');
	});

	afterEach(() => {
		if (fs.existsSync(TEST_DB_PATH)) {
			fs.rmSync(TEST_DB_PATH);
		}
	});

	test('garbageCollectJsonDb: finds expired projects', () => {
		const result = _sut.garbageCollectJsonDb("sfdaf", "fasdfa")

		assert.equal(result, "")
	});
});
