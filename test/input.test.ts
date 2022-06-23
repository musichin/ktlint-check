import {jest, expect, it, describe} from '@jest/globals';
import {Input} from '../src/types';

function getInput(input: {[key: string]: string}): Input {
  const variables: {[key: string]: string} = {
    level: 'error',
    'ktlint-version': '0.46.1',
    ...input,
  };
  jest.resetModules();
  for (const key in variables) {
    process.env[`INPUT_${key.toUpperCase()}`] = variables[key];
  }
  return require('./../src/input');
}

describe('ktlintVersion', () => {
  it('undefined', () => {
    expect(() => getInput({'ktlint-version': ''})).toThrow(
      'Input "ktlint-version" required but not supplied',
    );
  });

  it('valid', () => {
    const {ktlintVersion} = getInput({'ktlint-version': '0.46.1'});
    expect(ktlintVersion).toEqual('0.46.1');
  });
});

describe('level', () => {
  it('undefined', () => {
    expect(() => getInput({level: ''})).toThrow(
      'Input "level" required but not supplied',
    );
  });

  it('invalid', () => {
    expect(() => getInput({level: 'test'})).toThrow(
      'Input "level" must be one of: error, warning, notice or none',
    );
  });

  it('valid', () => {
    const {level} = getInput({level: 'warning'});
    expect(level).toEqual('warning');
  });
});
