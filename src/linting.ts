import * as cmd from '@actions/core/lib/command';
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import {Options} from './types';

interface Issue {
  file: string;
  column: number;
  row: number;
  message: string;
}

function buildArguments(options?: Options): string[] {
  const args = [];
  if (options === undefined) {
    return [];
  }

  const {
    android,
    disabledRules,
    format,
    limit,
    relative,
    reporter,
    ruleset,
    editorconfig,
    experimental,
    baseline,
    patterns,
  } = options;

  if (android === true) {
    args.push('--android');
  }

  if (disabledRules != undefined && disabledRules.length > 0) {
    args.push(`--disabled_rules=${disabledRules.join(',')}`);
  }

  if (format === true) {
    args.push('--format');
  }

  if (limit !== undefined) {
    args.push(`--limit=${limit}`);
  }

  if (relative === true) {
    args.push('--relative');
  }

  if (reporter !== undefined) {
    reporter.forEach((r) => args.push(`--reporter=${r}`));
  }

  if (ruleset !== undefined) {
    args.push(`--ruleset=${ruleset}`);
  }

  if (editorconfig !== undefined) {
    args.push(`--editorconfig=${editorconfig}`);
  }

  if (experimental === true) {
    args.push('--experimental');
  }

  if (baseline !== undefined) {
    args.push(`--baseline=${baseline}`);
  }

  if (patterns !== undefined) {
    patterns.forEach(args.push);
  }

  return args;
}

async function lint(options?: Options) {
  core.startGroup('ktlint check');
  const execOptions = {
    listeners: {
      stdline: analizeLine,
    },
    ignoreReturnCode: true,
  };
  const args = buildArguments(options);
  const exitCode = await exec.exec('ktlint', args, execOptions);
  core.endGroup();

  if (exitCode !== 0) {
    throw new Error(`ktlint exited with code ${exitCode}`);
  }
}

function analizeLine(line: string) {
  const {file, row, column, message} = parseLine(line);
  const properties = {
    startLine: row,
    startColumn: column,
    file,
  };
  // TODO https://github.com/actions/toolkit/issues/892
  cmd.issueCommand('error', properties, message);
  // core.error(message, properties);
}

function parseLine(line: string): Issue {
  const data = line.split(':', 3);

  const [file, row, column, message] = data;

  if (
    file === undefined ||
    row === undefined ||
    column === undefined ||
    message == undefined
  ) {
    throw new Error(`Could not parse line: ${line}`);
  }

  return {
    file: file.trim(),
    row: Number(row),
    column: Number(column),
    message: message.trim(),
  };
}

export {lint, buildArguments};
