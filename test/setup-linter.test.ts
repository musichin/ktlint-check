import {install} from '../src/setup-linter';

describe('#setup-linter', () => {
  describe('#install', () => {
    test('specific version', async () => {
      const tool = await install('1.5.0');
      expect(tool).toBeTruthy();
      expect(tool.name).toStrictEqual('ktlint');
    }, 60_000);
  });
});
