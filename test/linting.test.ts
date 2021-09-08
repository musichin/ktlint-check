import {expect, it, describe} from '@jest/globals';
import {install} from '../src/setup';
import {lint} from '../src/linting';

describe('#linting', () => {
  it('#lint', async () => {
    await install('0.42.0');
    await lint();
    expect(true).toBeTruthy();
  });
});
