interface Options {
  android?: boolean;
  debug?: boolean;
  trace?: boolean;
  disabledRules?: string[];
  format?: boolean;
  limit?: number;
  relative?: boolean;
  reporter?: string[];
  ruleset?: string;
  verbose?: boolean;
  editorconfig?: string;
  experimental?: boolean;
  baseline?: string;
  logLevel?: string;
  patterns?: string[];
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

export {Options, Input, Level, Tool};
