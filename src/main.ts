import * as core from '@actions/core';
import {exec} from '@actions/exec';
import input from './input';
import {install as installLinter} from './setup-linter';
import {install as installReporter} from './setup-reporter';
import {buildArguments} from './linting';
import {Options} from './types';

async function lint(args: string[]): Promise<number> {
  core.startGroup('ktlint check');
  const execOptions = {
    ignoreReturnCode: true,
  };
  const exitCode = await exec('ktlint', args, execOptions);
  core.endGroup();

  return exitCode;
}

async function createReporter(path: string, warn: boolean): Promise<string> {
  const args = warn ? '?warning' : '';
  return `--reporter="github-workflow${args},artifact=${path}`;
}

async function run() {
  const {version, warn, annotate} = input;

  await installLinter(version);
  const reporterPath = annotate ? await installReporter() : null;
  const reporter = reporterPath
    ? await createReporter(reporterPath, warn)
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

run().catch(core.setFailed);
