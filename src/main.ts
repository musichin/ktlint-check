import * as core from '@actions/core';
import {exec} from '@actions/exec';
import input from './input';
import {install as installLinter} from './setup-linter';
import {install as installReporter} from './setup-reporter';
import {buildArguments} from './linter';
import {Input, Options, Tool} from './types';

async function lint(args: string[]): Promise<number> {
  core.startGroup('ktlint check');
  const execOptions = {
    ignoreReturnCode: true,
  };
  const exitCode = await exec('ktlint', args, execOptions);
  core.endGroup();

  return exitCode;
}

async function createReporter(tool: Tool, warn: boolean): Promise<string> {
  const {path} = tool;
  const args = warn ? '?warn' : '';
  return `github${args},artifact=${path}`;
}

async function check(input: Input) {
  const {version, warn, annotate} = input;

  await installLinter(version);
  const reporterTool = annotate ? await installReporter() : null;
  const reporter = reporterTool
    ? await createReporter(reporterTool, warn)
    : null;
  const options: Options = {
    ...input,
    ...(reporter && {
      reporter: [...(input.reporter ?? []), reporter],
    }),
  };

  const args = buildArguments(options);
  const exitCode = await lint(args);

  if (exitCode !== 0 && !warn) {
    throw new Error(`ktlint exited with code ${exitCode}`);
  }
}

check(input).catch(core.setFailed);
