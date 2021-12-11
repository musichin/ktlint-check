import {getBooleanInput, getInput} from '@actions/core';
import {Input} from './types';

const VERSION_DEFAUL = '0.43.2';
const ANNOTATE_DEFAULT = true;
const WARN_DEFAULT = false;

function getBoolean(name: string): boolean | undefined {
  try {
    return getBooleanInput(name);
  } catch (err) {
    const value = getInput(name);
    if (value.length <= 0) {
      return undefined;
    } else {
      throw new TypeError(`Value ${value} of ${name} is not a boolean`);
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
  if (!isFinite(num)) {
    throw new TypeError(`Value ${value} of ${name} is not a number`);
  }

  return num;
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

const version = getString('version') ?? VERSION_DEFAUL;
const annotate = getBoolean('annotate') ?? ANNOTATE_DEFAULT;
const warn = getBoolean('warn') ?? WARN_DEFAULT;

const input: Input = {
  version,
  annotate,
  warn,

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
