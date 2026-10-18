import { parseInput } from '../src/input';

const SHA256 = 'a3fd620207d5c40da6ca789b95e7f823c54e854b7fade7f613e91096a3706d75';

function setEnvVars(input?: { [key: string]: string }) {
  const variables: { [key: string]: string } = {
    level: 'error',
    'ktlint-version': '1.8.0',
    limit: '',
    'ignore-autocorrect-failures': '',
    'disabled-rules': '',
    patterns: '',
    ...input,
  };
  for (const variable in variables) {
    const value = variables[variable];
    const key = `INPUT_${variable.toUpperCase()}`;
    process.env[key] = value;
  }
}

describe('parseInput', () => {
  describe('ktlint-version', () => {
    test('undefined', () => {
      setEnvVars({ 'ktlint-version': '' });
      expect(() => parseInput()).toThrow('Input "ktlint-version" required but not supplied');
    });

    test('valid', () => {
      setEnvVars({ 'ktlint-version': '1.8.0' });
      const { ktlintVersion } = parseInput();
      expect(ktlintVersion).toEqual('1.8.0');
    });

    test('leading v', () => {
      setEnvVars({ 'ktlint-version': 'v1.8.0' });
      const { ktlintVersion } = parseInput();
      expect(ktlintVersion).toEqual('1.8.0');
    });

    test('invalid', () => {
      setEnvVars({ 'ktlint-version': 'latest' });
      expect(() => parseInput()).toThrow('Input "ktlint-version" must be a valid version, e.g. "1.8.0"');
    });

    test('older than 1.0.0', () => {
      setEnvVars({ 'ktlint-version': '0.50.0' });
      expect(() => parseInput()).toThrow('Input "ktlint-version" must be 1.0.0 or newer, got 0.50.0');
    });

    test('pre-release of 1.0.0', () => {
      setEnvVars({ 'ktlint-version': '1.0.0-rc1' });
      expect(() => parseInput()).toThrow('Input "ktlint-version" must be 1.0.0 or newer, got 1.0.0-rc1');
    });

    test('1.0.0', () => {
      setEnvVars({ 'ktlint-version': '1.0.0' });
      const { ktlintVersion } = parseInput();
      expect(ktlintVersion).toEqual('1.0.0');
    });

    test('without sha256', () => {
      setEnvVars({ 'ktlint-version': '1.8.0' });
      const { ktlintSha256 } = parseInput();
      expect(ktlintSha256).toBeUndefined();
    });

    test('with sha256', () => {
      setEnvVars({ 'ktlint-version': `v1.8.0@sha256:${SHA256}` });
      const { ktlintVersion, ktlintSha256 } = parseInput();
      expect(ktlintVersion).toEqual('1.8.0');
      expect(ktlintSha256).toEqual(SHA256);
    });

    test('with uppercase sha256', () => {
      setEnvVars({ 'ktlint-version': `1.8.0@sha256:${SHA256.toUpperCase()}` });
      const { ktlintSha256 } = parseInput();
      expect(ktlintSha256).toEqual(SHA256);
    });

    test('with invalid sha256', () => {
      setEnvVars({ 'ktlint-version': '1.8.0@sha256:abc' });
      expect(() => parseInput()).toThrow(
        'Input "ktlint-version" must be a version, optionally followed by "@sha256:<checksum>"',
      );
    });

    test('with invalid version and sha256', () => {
      setEnvVars({ 'ktlint-version': `latest@sha256:${SHA256}` });
      expect(() => parseInput()).toThrow('Input "ktlint-version" must be a valid version, e.g. "1.8.0"');
    });
  });

  describe('level', () => {
    test('undefined', () => {
      setEnvVars({ level: '' });
      expect(() => parseInput()).toThrow('Input "level" required but not supplied');
    });

    test('invalid', () => {
      setEnvVars({ level: 'test' });
      expect(() => parseInput()).toThrow('Input "level" must be one of: error, warning, notice or none');
    });

    test('valid', () => {
      setEnvVars({ level: 'warning' });
      const { level } = parseInput();
      expect(level).toEqual('warning');
    });
  });

  describe('ignore-autocorrect-failures', () => {
    test('undefined', () => {
      setEnvVars({ 'ignore-autocorrect-failures': '' });
      const { ignoreAutocorrectFailures } = parseInput();
      expect(ignoreAutocorrectFailures).toBeUndefined();
    });

    test('valid', () => {
      setEnvVars({ 'ignore-autocorrect-failures': 'true' });
      const { ignoreAutocorrectFailures } = parseInput();
      expect(ignoreAutocorrectFailures).toStrictEqual(true);
    });

    test('invalid', () => {
      setEnvVars({ 'ignore-autocorrect-failures': 'NaN' });
      expect(() => parseInput()).toThrow('Input "ignore-autocorrect-failures" must be a boolean');
    });
  });

  describe('limit', () => {
    test('undefined', () => {
      setEnvVars({ limit: '' });
      const { limit } = parseInput();
      expect(limit).toBeUndefined();
    });

    test('valid', () => {
      setEnvVars({ limit: '5' });
      const { limit } = parseInput();
      expect(limit).toStrictEqual(5);
    });

    test('invalid', () => {
      setEnvVars({ limit: 'NaN' });
      expect(() => parseInput()).toThrow('Input "limit" must be a number');
    });
  });

  describe('patterns', () => {
    test('undefined', () => {
      setEnvVars({ patterns: '' });
      const { patterns } = parseInput();
      expect(patterns).toBeUndefined();
    });

    test('empty', () => {
      setEnvVars({ patterns: '\n   \n' });
      const { patterns } = parseInput();
      expect(patterns).toBeUndefined();
    });

    test('valid', () => {
      setEnvVars({ patterns: 'a\nb\n   \nc' });
      const { patterns } = parseInput();
      expect(patterns).toStrictEqual(['a', 'b', 'c']);
    });
  });

  describe('code-style', () => {
    test('undefined', () => {
      setEnvVars({ 'code-style': '' });
      const { codeStyle } = parseInput();
      expect(codeStyle).toBeUndefined();
    });

    test('valid', () => {
      setEnvVars({ 'code-style': 'ktlint_official' });
      const { codeStyle } = parseInput();
      expect(codeStyle).toEqual('ktlint_official');
    });
  });

  describe('disabled_rules', () => {
    test('undefined', () => {
      setEnvVars({ 'disabled-rules': '' });
      setEnvVars({ disabled_rules: '' });
      const { disabledRules } = parseInput();
      expect(disabledRules).toBeUndefined();
    });

    test('empty', () => {
      setEnvVars({ 'disabled-rules': '' });
      setEnvVars({ disabled_rules: '\n   \n' });
      const { disabledRules } = parseInput();
      expect(disabledRules).toBeUndefined();
    });

    test('valid', () => {
      setEnvVars({ 'disabled-rules': '' });
      setEnvVars({ disabled_rules: 'a\nb\n   \nc' });
      const { disabledRules } = parseInput();
      expect(disabledRules).toStrictEqual(['a', 'b', 'c']);
    });
  });

  describe('disabled-rules', () => {
    test('undefined', () => {
      setEnvVars({ disabled_rules: '' });
      setEnvVars({ 'disabled-rules': '' });
      const { disabledRules } = parseInput();
      expect(disabledRules).toBeUndefined();
    });

    test('empty', () => {
      setEnvVars({ disabled_rules: '' });
      setEnvVars({ 'disabled-rules': '\n   \n' });
      const { disabledRules } = parseInput();
      expect(disabledRules).toBeUndefined();
    });

    test('valid', () => {
      setEnvVars({ disabled_rules: '' });
      setEnvVars({ 'disabled-rules': 'a\nb\n   \nc' });
      const { disabledRules } = parseInput();
      expect(disabledRules).toStrictEqual(['a', 'b', 'c']);
    });
  });
});
