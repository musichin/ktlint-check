import { getBooleanInput, getInput } from '@actions/core';
import semver from 'semver';
import type { Input, Level } from './types.js';

const MIN_KTLINT_VERSION = '1.0.0';

function getBoolean(name: string): boolean | undefined {
  try {
    return getBooleanInput(name);
  } catch {
    const value = getInput(name);
    if (value.length <= 0) {
      return undefined;
    } else {
      throw new TypeError(`Input "${name}" must be a boolean`);
    }
  }
}

function getList(name: string): string[] | undefined {
  const value = getInput(name);
  if (value.length <= 0) {
    return undefined;
  }

  const values = value
    .split('\n')
    .map((v) => v.trim())
    .filter((v) => v.length > 0);

  return values;
}

function getString(name: string): string | undefined {
  const value = getInput(name);
  if (value.length <= 0) {
    return undefined;
  }

  return value;
}

function getNumber(name: string): number | undefined {
  const value = getInput(name);
  if (value.length <= 0) {
    return undefined;
  }

  const num = Number(value);
  if (!Number.isFinite(num)) {
    throw new TypeError(`Input "${name}" must be a number`);
  }

  return num;
}

function getInteger(name: string): number | undefined {
  const value = getNumber(name);
  if (value === undefined) {
    return undefined;
  }

  if (!Number.isInteger(value)) {
    throw new TypeError(`Input "${name}" must be an integer`);
  }

  return value;
}

function getKtlintVersion(): { version: string; sha256?: string } {
  const input = getString('ktlint-version');
  if (input === undefined) {
    throw new Error('Input "ktlint-version" required but not supplied');
  }

  const { version, sha256 } = /^(?<version>[^@]+)(?:@sha256:(?<sha256>[0-9a-f]{64}))?$/i.exec(input)?.groups ?? {};
  if (version === undefined) {
    throw new Error('Input "ktlint-version" must be a version, optionally followed by "@sha256:<checksum>"');
  }

  const cleanVersion = semver.clean(version);
  if (cleanVersion === null) {
    throw new Error('Input "ktlint-version" must be a valid version, e.g. "1.8.0"');
  }

  if (semver.lt(cleanVersion, MIN_KTLINT_VERSION)) {
    throw new Error(`Input "ktlint-version" must be ${MIN_KTLINT_VERSION} or newer, got ${cleanVersion}`);
  }

  return { version: cleanVersion, sha256: sha256?.toLowerCase() };
}

function isLevel(level: string): level is Level {
  return ['error', 'warning', 'notice', 'none'].includes(level);
}

function getLevel(): Level {
  const level = getString('level');
  if (level === undefined) {
    throw new Error('Input "level" required but not supplied');
  }

  if (!isLevel(level)) {
    throw new Error('Input "level" must be one of: error, warning, notice or none');
  }

  return level;
}

function parseInput(): Input {
  const { version: ktlintVersion, sha256: ktlintSha256 } = getKtlintVersion();
  const level = getLevel();

  const patterns = getList('patterns');
  const codeStyle = getString('code-style');
  const format = getBoolean('format');
  const ignoreAutocorrectFailures = getBoolean('ignore-autocorrect-failures');
  const limit = getInteger('limit');
  const relative = getBoolean('relative');
  const reporter = getList('reporter');
  const ruleset = getString('ruleset');
  const editorconfig = getString('editorconfig');
  const experimental = getBoolean('experimental');
  const baseline = getString('baseline');
  const logLevel = getString('log-level');

  const disabledRules = getList('disabled-rules') ?? getList('disabled_rules'); // deprecated

  return {
    ktlintVersion,
    ktlintSha256,
    level,

    patterns,
    codeStyle,
    disabledRules,
    format,
    ignoreAutocorrectFailures,
    limit,
    relative,
    reporter,
    ruleset,
    editorconfig,
    experimental,
    baseline,
    logLevel,
  };
}

export { parseInput };
