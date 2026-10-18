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
  const { ktlintVersion, ktlintSha256, level } = input;

  const linterTool = await installLinter(ktlintVersion, ktlintSha256);
  const reporterTool = await installReporter();
  const reporter = createReporter(reporterTool, level);
  const options: Options = {
    ...input,
    reporter: [...(input.reporter ?? []), reporter],
  };

  const args = buildArguments(options);
  await exec('java', ['-jar', linterTool.path, ...args]);
}

async function run() {
  await check(parseInput());
}

run().catch(core.setFailed);
