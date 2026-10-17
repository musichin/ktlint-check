import { install } from '../src/setup-linter';

describe('#setup-linter', () => {
  describe('#install', () => {
    test('specific version', async () => {
      const tool = await install('1.8.0');
      expect(tool).toBeTruthy();
      expect(tool.name).toStrictEqual('ktlint');
    }, 60_000);

    test('specific version with sha256', async () => {
      const tool = await install('1.8.0', 'a3fd620207d5c40da6ca789b95e7f823c54e854b7fade7f613e91096a3706d75');
      expect(tool).toBeTruthy();
      expect(tool.name).toStrictEqual('ktlint');
    }, 60_000);

    test('specific version with invalid sha256', async () => {
      await expect(install('1.8.0', '0'.repeat(64))).rejects.toThrow(
        `Checksum mismatch for ktlint:1.8.0@sha256:${'0'.repeat(64)}`,
      );
    }, 60_000);
  });
});
