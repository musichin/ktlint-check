interface Options {
  patterns?: string[];
  codeStyle?: string;
  disabledRules?: string[];
  format?: boolean;
  ignoreAutocorrectFailures?: boolean;
  limit?: number;
  relative?: boolean;
  reporter?: string[];
  ruleset?: string;
  editorconfig?: string;
  experimental?: boolean;
  baseline?: string;
  logLevel?: string;

  android?: boolean; // deprecated
  debug?: boolean; // deprecated
  trace?: boolean; // deprecated
  verbose?: boolean; // deprecated
}

type Level = 'error' | 'warning' | 'notice' | 'none';

interface Input extends Options {
  ktlintVersion: string;
  level: Level;
}

interface Tool {
  /**
   * Name of the tool.
   */
  name: string;
  /**
   * Version of the tool.
   */
  version: string;
  /**
   * Installation directory
   */
  directory: string;
  /**
   * Filename (simple) of the tool.
   */
  filename: string;
  /**
   * Complete path to the tool (directory + filename)
   */
  path: string;
}

export type { Options, Input, Level, Tool };
