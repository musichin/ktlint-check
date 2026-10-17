import { install } from '../src/setup-reporter';

describe('#setup-reporter', () => {
  describe('#install', () => {
    test('latest version', async () => {
      const tool = await install();
      expect(tool).toBeTruthy();
      expect(tool.name).toStrictEqual('ktlint-github-reporter');
      expect(tool.version).toStrictEqual('3.5.0');
    }, 60_000);
  });
});
