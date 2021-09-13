interface Options {
  android?: boolean;
  disabledRules?: string[];
  format?: boolean;
  limit?: number;
  relative?: boolean;
  reporter?: string[];
  ruleset?: string;
  editorconfig?: string;
  experimental?: boolean;
  baseline?: string;
  patterns?: string[];
}

interface Input extends Options {
  version: string;
  annotate: boolean;
  warn: boolean;
}

export {Options, Input};
