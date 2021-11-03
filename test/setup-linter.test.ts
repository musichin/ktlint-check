import {expect, it, describe} from '@jest/globals';
import {install, getLatestVersion} from '../src/setup-linter';

describe('#setup-linter', () => {
  describe('#getLatestVersion', () => {
    it('successfully', async () => {
      const downloadUrl = await getLatestVersion();
      expect(downloadUrl).toBeTruthy();
    });
  });

  describe('#install', () => {
    it('specific version', async () => {
      const tool = await install('0.43.0');
      expect(tool).toBeTruthy();
      expect(tool.name).toStrictEqual('ktlint');
    }, 60_000);
  });
});
