import * as core from '@actions/core';
import { exec } from '@actions/exec';
import { parseInput } from './input.js';
import { buildArguments } from './linter.js';
import { install as installLinter } from './setup-linter.js';
import { install as installReporter } from './setup-reporter.js';
import type { Input, Level, Options, Tool } from './types.js';

function createReporter(tool: Tool, level: Level): string {
  const { path } = tool;
  return `github?level=${level},artifact=${path}`;
}

async function check(input: Input) {
  const { ktlintVersion, level } = input;

  await installLinter(ktlintVersion);
  const reporterTool = await installReporter(ktlintVersion);
  const reporter = createReporter(reporterTool, level);
  const options: Options = {
    ...input,
    reporter: [...(input.reporter ?? []), reporter],
  };

  const args = buildArguments(options);
  await exec('ktlint', args);
}

check(parseInput()).catch(core.setFailed);
