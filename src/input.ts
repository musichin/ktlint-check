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
  const ktlintVersion = getString('ktlint-version');
  if (ktlintVersion === undefined) {
    throw new Error('Input "ktlint-version" required but not supplied');
  }

  return ktlintVersion;
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

function parseInput(): Input {
  const ktlintVersion = getKtlintVersion();
  const level = getLevel();

  const patterns = getList('patterns');
  const codeStyle = getString('disabled_rules');
  const disabledRules = getList('disabled_rules');
  const format = getBoolean('format');
  const limit = getNumber('limit');
  const relative = getBoolean('relative');
  const reporter = getList('reporter');
  const ruleset = getString('ruleset');
  const editorconfig = getString('editorconfig');
  const experimental = getBoolean('experimental');
  const baseline = getString('baseline');
  const logLevel = getString('log-level');

  const android = getBoolean('android'); // deprecated
  const debug = getBoolean('debug'); // deprecated
  const trace = getBoolean('trace'); // deprecated
  const verbose = getBoolean('verbose'); // deprecated

  return {
    ktlintVersion,
    level,

    patterns,
    codeStyle,
    disabledRules,
    format,
    limit,
    relative,
    reporter,
    ruleset,
    editorconfig,
    experimental,
    baseline,
    logLevel,

    android,
    debug,
    trace,
    verbose,
  };
}

export {parseInput};
