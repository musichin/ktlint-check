import * as core from '@actions/core';
import * as fs from 'fs';
import {Tool} from './types';
import {getOrDownload} from './tool-provisioner';

const TOOL_NAME = 'ktlint';
const TOOL_FILENAME = TOOL_NAME;

function buildDownloadUrl(version: string): string {
  return `https://github.com/pinterest/ktlint/releases/download/${version}/ktlint`;
}

async function provision(version: string): Promise<Tool> {
  return getOrDownload(
    TOOL_NAME,
    version,
    buildDownloadUrl(version),
    TOOL_FILENAME,
  );
}

async function install(version: string): Promise<Tool> {
  const tool = await provision(version);
  fs.chmodSync(tool.path, '777');
  core.addPath(tool.directory);
  return tool;
}

export {install};
