import {expect, it, describe} from '@jest/globals';
import {install} from '../src/setup-linter';

describe('#setup-linter', () => {
  describe('#install', () => {
    it('specific version', async () => {
      const tool = await install('0.46.1');
      expect(tool).toBeTruthy();
      expect(tool.name).toStrictEqual('ktlint');
    }, 60_000);
  });
});
