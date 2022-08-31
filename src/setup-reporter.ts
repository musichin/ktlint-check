import {Tool} from './types';
import {getOrDownload} from './tool-provisioner';

const TOOL_VERSION = '2.2.0';
const TOOL_NAME = 'ktlint-github-reporter';
const TOOL_FILENAME = `${TOOL_NAME}.jar`;

function buildDownloadUrl(version: string): string {
  return `https://github.com/musichin/ktlint-github-reporter/releases/download/${version}/${TOOL_FILENAME}`;
}

async function provision(version: string): Promise<Tool> {
  return getOrDownload(
    TOOL_NAME,
    version,
    buildDownloadUrl(version),
    TOOL_FILENAME,
  );
}

async function install(): Promise<Tool> {
  return await provision(TOOL_VERSION);
}

export {install};
