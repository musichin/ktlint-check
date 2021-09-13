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

export {Options, Input, Tool};
