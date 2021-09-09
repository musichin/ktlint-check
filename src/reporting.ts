import * as cmd from '@actions/core/lib/command';

const PLAIN_LINE_REGEX = /^([^:]+):([^:]+):([^:]+):(.*)$/g;

interface Issue {
  file: string;
  column: number;
  row: number;
  message: string;
}

function processPlainLine(line: string) {
  const {file, row, column, message} = parsePlainLine(line);
  const properties = {
    startLine: row,
    startColumn: column,
    file,
  };
  // TODO https://github.com/actions/toolkit/issues/892
  cmd.issueCommand('error', properties, message);
  // core.error(message, properties);
}

function parsePlainLine(line: string): Issue {
  const data = line.match(PLAIN_LINE_REGEX);

  if (!data) {
    throwErrorPlainLine(line);
  }

  const [, file, row, column, message] = data;

  if (
    file === undefined ||
    row === undefined ||
    column === undefined ||
    message == undefined
  ) {
    throwErrorPlainLine(line);
  }

  return {
    file: file.trim(),
    row: Number(row),
    column: Number(column),
    message: message.trim(),
  };
}

function throwErrorPlainLine(line: string): never {
  throw new Error(`Could not parse line: ${line}`);
}

export {parsePlainLine, processPlainLine};
