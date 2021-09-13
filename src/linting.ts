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

export {buildArguments};
