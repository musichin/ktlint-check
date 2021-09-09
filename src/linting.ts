import * as core from '@actions/core';
import * as exec from '@actions/exec';
import {processPlainLine} from './reporting';
import {Options} from './types';

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
      stdline: processPlainLine,
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

export {lint, buildArguments};
