import {Options} from './types';

function buildArguments(options?: Options): string[] {
  const args: string[] = [];
  if (options === undefined) {
    return args;
  }

  const {
    android,
    debug,
    trace,
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
    logLevel,
    patterns,
  } = options;

  if (android === true) {
    args.push('--android');
  }

  if (debug === true) {
    args.push('--debug');
  }

  if (trace === true) {
    args.push('--trace');
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

  if (verbose === true) {
    args.push('--verbose');
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

  if (logLevel !== undefined) {
    args.push(`--log-level=${logLevel}`);
  }

  if (patterns !== undefined) {
    patterns.forEach((pattern) => args.push(pattern));
  }

  return args;
}

export {buildArguments};
