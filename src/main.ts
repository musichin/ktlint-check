import * as core from '@actions/core';
import options from './input';
import {install} from './setup';
import {lint} from './linting';

async function run() {
  const {version} = options;
  await install(version);
  await lint(options);
}

run().catch(core.setFailed);
