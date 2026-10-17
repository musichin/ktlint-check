import { getOrDownload } from './tool-provisioner.js';
import type { Tool } from './types.js';

const TOOL_NAME = 'ktlint';
const TOOL_FILENAME = TOOL_NAME;

function buildDownloadUrl(version: string): string {
  return `https://github.com/ktlint/ktlint/releases/download/${version}/ktlint`;
}

async function install(version: string, sha256?: string): Promise<Tool> {
  return getOrDownload(TOOL_NAME, version, buildDownloadUrl(version), TOOL_FILENAME, sha256);
}

export { install };
