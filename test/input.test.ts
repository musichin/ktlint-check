import {parseInput} from '../src/input';

function setEnvVars(input?: {[key: string]: string}) {
  const variables: {[key: string]: string} = {
    level: 'error',
    'ktlint-version': '1.7.0',
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
  describe('ktlint-version', () => {
    test('undefined', () => {
      setEnvVars({'ktlint-version': ''});
      expect(() => parseInput()).toThrow(
        'Input "ktlint-version" required but not supplied',
      );
    });

    test('valid', () => {
      setEnvVars({'ktlint-version': '1.7.0'});
      const {ktlintVersion} = parseInput();
      expect(ktlintVersion).toEqual('1.7.0');
    });
  });

  describe('level', () => {
    test('undefined', () => {
      setEnvVars({level: ''});
      expect(() => parseInput()).toThrow(
        'Input "level" required but not supplied',
      );
    });

    test('invalid', () => {
      setEnvVars({level: 'test'});
      expect(() => parseInput()).toThrow(
        'Input "level" must be one of: error, warning, notice or none',
      );
    });

    test('valid', () => {
      setEnvVars({level: 'warning'});
      const {level} = parseInput();
      expect(level).toEqual('warning');
    });
  });

  describe('android', () => {
    test('undefined', () => {
      setEnvVars({android: ''});
      const {android} = parseInput();
      expect(android).toBeUndefined();
    });

    test('false', () => {
      setEnvVars({android: 'false'});
      const {android} = parseInput();
      expect(android).toStrictEqual(false);
    });

    test('true', () => {
      setEnvVars({android: 'true'});
      const {android} = parseInput();
      expect(android).toStrictEqual(true);
    });

    test('invalid', () => {
      setEnvVars({android: 'not_a_boolean'});
      expect(() => parseInput()).toThrow('Input "android" must be a boolean');
    });
  });

  describe('limit', () => {
    test('undefined', () => {
      setEnvVars({limit: ''});
      const {limit} = parseInput();
      expect(limit).toBeUndefined();
    });

    test('valid', () => {
      setEnvVars({limit: '5'});
      const {limit} = parseInput();
      expect(limit).toStrictEqual(5);
    });

    test('invalid', () => {
      setEnvVars({limit: 'NaN'});
      expect(() => parseInput()).toThrow('Input "limit" must be a number');
    });
  });

  describe('patterns', () => {
    test('undefined', () => {
      setEnvVars({patterns: ''});
      const {patterns} = parseInput();
      expect(patterns).toBeUndefined();
    });

    test('empty', () => {
      setEnvVars({patterns: '\n   \n'});
      const {patterns} = parseInput();
      expect(patterns).toBeUndefined();
    });

    test('valid', () => {
      setEnvVars({patterns: 'a\nb\n   \nc'});
      const {patterns} = parseInput();
      expect(patterns).toStrictEqual(['a', 'b', 'c']);
    });
  });

  describe('code-style', () => {
    test('undefined', () => {
      setEnvVars({'code-style': ''});
      const {codeStyle} = parseInput();
      expect(codeStyle).toBeUndefined();
    });

    test('valid', () => {
      setEnvVars({'code-style': 'ktlint_official'});
      const {codeStyle} = parseInput();
      expect(codeStyle).toEqual('ktlint_official');
    });
  });

  describe('disabled_rules', () => {
    test('undefined', () => {
      setEnvVars({'disabled-rules': ''});
      setEnvVars({disabled_rules: ''});
      const {disabledRules} = parseInput();
      expect(disabledRules).toBeUndefined();
    });

    test('empty', () => {
      setEnvVars({'disabled-rules': ''});
      setEnvVars({disabled_rules: '\n   \n'});
      const {disabledRules} = parseInput();
      expect(disabledRules).toBeUndefined();
    });

    test('valid', () => {
      setEnvVars({'disabled-rules': ''});
      setEnvVars({disabled_rules: 'a\nb\n   \nc'});
      const {disabledRules} = parseInput();
      expect(disabledRules).toStrictEqual(['a', 'b', 'c']);
    });
  });

  describe('disabled-rules', () => {
    test('undefined', () => {
      setEnvVars({disabled_rules: ''});
      setEnvVars({'disabled-rules': ''});
      const {disabledRules} = parseInput();
      expect(disabledRules).toBeUndefined();
    });

    test('empty', () => {
      setEnvVars({disabled_rules: ''});
      setEnvVars({'disabled-rules': '\n   \n'});
      const {disabledRules} = parseInput();
      expect(disabledRules).toBeUndefined();
    });

    test('valid', () => {
      setEnvVars({disabled_rules: ''});
      setEnvVars({'disabled-rules': 'a\nb\n   \nc'});
      const {disabledRules} = parseInput();
      expect(disabledRules).toStrictEqual(['a', 'b', 'c']);
    });
  });
});
