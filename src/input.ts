import {getBooleanInput, getInput} from '@actions/core';
import {Input, Level} from './types';

function getBoolean(name: string): boolean | undefined {
  try {
    return getBooleanInput(name);
  } catch (err) {
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
  if (values.length <= 0) {
    return undefined;
  }

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

function getKtlintVersion(): string {
  const ktlinVersion = getString('ktlint-version');
  if (ktlinVersion === undefined) {
    throw new Error('Input "ktlint-version" required but not supplied');
  }

  return ktlinVersion;
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
    throw new Error(
      'Input "level" must be one of: error, warning, notice or none',
    );
  }

  return level;
}

const android = getBoolean('android');
const debug = getBoolean('debug');
const disabledRules = getList('disabled_rules');
const format = getBoolean('format');
const limit = getNumber('limit');
const relative = getBoolean('relative');
const reporter = getList('reporter');
const ruleset = getString('ruleset');
const verbose = getBoolean('verbose');
const editorconfig = getString('editorconfig');
const experimental = getBoolean('experimental');
const baseline = getString('baseline');
const patterns = getList('patterns');

const ktlintVersion = getKtlintVersion();
const level = getLevel();

const input: Input = {
  ktlintVersion,
  level,

  android,
  debug,
  disabledRules,
  format,
  limit,
  relative,
  reporter,
  ruleset,
  verbose,
  editorconfig,
  experimental,
  baseline,
  patterns,
};

export = input;
