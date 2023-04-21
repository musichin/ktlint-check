import {Options} from './types';

function buildArguments(options?: Options): string[] {
  const args: string[] = [];
  if (options === undefined) {
    return args;
  }

  const {
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

    android, // deprecated
    debug, // deprecated
    trace, // deprecated
    verbose, // deprecated
  } = options;

  if (logLevel !== undefined) {
    args.push(`--log-level=${logLevel}`);
  }

  if (codeStyle !== undefined) {
    args.push(`--code-style=${codeStyle}`);
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
    patterns.forEach((pattern) => args.push(pattern));
  }

  // deprecated
  if (android === true) {
    args.push('--android');
  }

  if (debug === true) {
    args.push('--debug');
  }

  if (trace === true) {
    args.push('--trace');
  }

  if (verbose === true) {
    args.push('--verbose');
  }

  return args;
}

export {buildArguments};
