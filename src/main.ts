import * as core from '@actions/core';
import {exec} from '@actions/exec';
import input from './input';
import {install as installLinter} from './setup-linter';
import {install as installReporter} from './setup-reporter';
import {buildArguments} from './linter';
import {Input, Level, Options, Tool} from './types';

async function lint(args: string[]): Promise<number> {
  core.startGroup('ktlint check');
  const execOptions = {
    ignoreReturnCode: true,
  };
  const exitCode = await exec('ktlint', args, execOptions);
  core.endGroup();

  return exitCode;
}

async function createReporter(tool: Tool, level: Level): Promise<string> {
  const {path} = tool;
  return `github?level=${level},artifact=${path}`;
}

async function check(input: Input) {
  const {ktlintVersion, level} = input;

  await installLinter(ktlintVersion);
  const reporterTool = await installReporter();
  const reporter = await createReporter(reporterTool, level);
  const options: Options = {
    ...input,
    reporter: [...(input.reporter ?? []), reporter],
  };

  const args = buildArguments(options);
  const exitCode = await lint(args);

  if (exitCode !== 0 && level === 'error') {
    throw new Error(`ktlint exited with code ${exitCode}.`);
  }
}

check(input).catch(core.setFailed);
