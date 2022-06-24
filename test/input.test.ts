import {expect, it, describe} from '@jest/globals';
import {parseInput} from '../src/input';

function setEnvVars(input?: {[key: string]: string}) {
  const variables: {[key: string]: string} = {
    level: 'error',
    'ktlint-version': '0.46.1',
    android: '',
    limit: '',
    patterns: '',
    ...input,
  };
  for (const key in variables) {
    process.env[`INPUT_${key.toUpperCase()}`] = variables[key];
  }
}

describe('parseInput', () => {
  describe('ktlintVersion', () => {
    it('undefined', () => {
      setEnvVars({'ktlint-version': ''});
      expect(() => parseInput()).toThrow(
        'Input "ktlint-version" required but not supplied',
      );
    });

    it('valid', () => {
      setEnvVars({'ktlint-version': '0.46.1'});
      const {ktlintVersion} = parseInput();
      expect(ktlintVersion).toEqual('0.46.1');
    });
  });

  describe('level', () => {
    it('undefined', () => {
      setEnvVars({level: ''});
      expect(() => parseInput()).toThrow(
        'Input "level" required but not supplied',
      );
    });

    it('invalid', () => {
      setEnvVars({level: 'test'});
      expect(() => parseInput()).toThrow(
        'Input "level" must be one of: error, warning, notice or none',
      );
    });

    it('valid', () => {
      setEnvVars({level: 'warning'});
      const {level} = parseInput();
      expect(level).toEqual('warning');
    });
  });

  describe('android', () => {
    it('undefined', () => {
      setEnvVars({android: ''});
      const {android} = parseInput();
      expect(android).toBeUndefined();
    });

    it('false', () => {
      setEnvVars({android: 'false'});
      const {android} = parseInput();
      expect(android).toStrictEqual(false);
    });

    it('true', () => {
      setEnvVars({android: 'true'});
      const {android} = parseInput();
      expect(android).toStrictEqual(true);
    });

    it('invalid', () => {
      setEnvVars({android: 'not_a_boolean'});
      expect(() => parseInput()).toThrow('Input "android" must be a boolean');
    });
  });

  describe('limit', () => {
    it('undefined', () => {
      setEnvVars({limit: ''});
      const {limit} = parseInput();
      expect(limit).toBeUndefined();
    });

    it('valid', () => {
      setEnvVars({limit: '5'});
      const {limit} = parseInput();
      expect(limit).toStrictEqual(5);
    });

    it('invalid', () => {
      setEnvVars({limit: 'NaN'});
      expect(() => parseInput()).toThrow('Input "limit" must be a number');
    });
  });

  describe('patterns', () => {
    it('undefined', () => {
      setEnvVars({patterns: ''});
      const {patterns} = parseInput();
      expect(patterns).toBeUndefined();
    });

    it('empty', () => {
      setEnvVars({patterns: '\n   \n'});
      const {patterns} = parseInput();
      expect(patterns).toBeUndefined();
    });

    it('valid', () => {
      setEnvVars({patterns: 'a\nb\n   \nc'});
      const {patterns} = parseInput();
      expect(patterns).toStrictEqual(['a', 'b', 'c']);
    });
  });
});
