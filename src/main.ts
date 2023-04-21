import * as core from '@actions/core';
import {exec} from '@actions/exec';
import {parseInput} from './input';
import {install as installLinter} from './setup-linter';
import {install as installReporter} from './setup-reporter';
import {buildArguments} from './linter';
import {Input, Level, Options, Tool} from './types';

async function createReporter(tool: Tool, level: Level): Promise<string> {
  const {path} = tool;
  return `github?level=${level},artifact=${path}`;
}

async function check(input: Input) {
  const {ktlintVersion, level} = input;

  await installLinter(ktlintVersion);
  const reporterTool = await installReporter(ktlintVersion);
  const reporter = await createReporter(reporterTool, level);
  const options: Options = {
    ...input,
    reporter: [...(input.reporter ?? []), reporter],
  };

  const args = buildArguments(options);
  await exec('ktlint', args);
}

check(parseInput()).catch(core.setFailed);
