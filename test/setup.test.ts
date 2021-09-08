import {expect, it, describe} from '@jest/globals';
import {install, getLatestVersion} from '../src/setup';

describe('#setup', () => {
  describe('#getLatestVersion', () => {
    it('successfully', async () => {
      const downloadUrl = await getLatestVersion();
      expect(downloadUrl).toBeTruthy();
    });
  });

  describe('#install', () => {
    it('specific version', async () => {
      const path = await install('0.42.1');
      expect(path).toBeTruthy();
    }, 60_000);
  });
});
