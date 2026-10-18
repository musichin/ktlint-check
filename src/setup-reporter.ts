import { getOrDownload } from './tool-provisioner.js';
import type { Tool } from './types.js';

const TOOL_NAME = 'ktlint-github-reporter';
const TOOL_FILENAME = `${TOOL_NAME}.jar`;
const TOOL_VERSION = '3.5.0';
const TOOL_SHA256 = '79b1991c86420dbdd6d9e40fe45adf1c89069e79a37cb6d6dfbae8fa83a5e410';

function buildDownloadUrl(version: string): string {
  return `https://github.com/musichin/ktlint-github-reporter/releases/download/${version}/${TOOL_FILENAME}`;
}

async function install(): Promise<Tool> {
  return getOrDownload(TOOL_NAME, TOOL_VERSION, buildDownloadUrl(TOOL_VERSION), TOOL_FILENAME, TOOL_SHA256);
}

export { install };
