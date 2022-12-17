import {install} from '../src/setup-reporter';

describe('#setup-reporter', () => {
  describe('#install', () => {
    test('specific version', async () => {
      const tool = await install();
      expect(tool).toBeTruthy();
      expect(tool.name).toStrictEqual('ktlint-github-reporter');
      expect(tool.version).toStrictEqual('2.3.0');
    }, 60_000);
  });
});
