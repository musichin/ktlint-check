import {install} from '../src/setup-reporter';

describe('#setup-reporter', () => {
  describe('#install', () => {
    test('ktlint verssion < 0.49.0', async () => {
      const tool = await install('0.48.2');
      expect(tool).toBeTruthy();
      expect(tool.name).toStrictEqual('ktlint-github-reporter');
      expect(tool.version).toStrictEqual('2.3.0');
    }, 60_000);

    test('ktlint verssion >= 0.49.0', async () => {
      const tool = await install('0.49.1');
      expect(tool).toBeTruthy();
      expect(tool.name).toStrictEqual('ktlint-github-reporter');
      expect(tool.version).toStrictEqual('3.0.1');
    }, 60_000);
  });
});
