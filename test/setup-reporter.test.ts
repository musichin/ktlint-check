import {install} from '../src/setup-reporter';

describe('#setup-reporter', () => {
  describe('#install', () => {
    test('ktlint version < 0.49.0', async () => {
      const tool = await install('0.48.2');
      expect(tool).toBeTruthy();
      expect(tool.name).toStrictEqual('ktlint-github-reporter');
      expect(tool.version).toStrictEqual('2.3.0');
    }, 60_000);

    test('ktlint version >= 0.49.0', async () => {
      const tool = await install('1.7.0');
      expect(tool).toBeTruthy();
      expect(tool.name).toStrictEqual('ktlint-github-reporter');
      expect(tool.version).toStrictEqual('3.3.0');
    }, 60_000);
  });
});
