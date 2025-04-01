import {Tool} from './types';
import {getOrDownload} from './tool-provisioner';
import semver from 'semver';

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

function getToolVersion(ktlintVersion: string) {
  if (semver.lt(ktlintVersion, '0.49.0')) {
    return '2.3.0';
  }

  return '3.2.0';
}

async function install(ktlintVersion: string): Promise<Tool> {
  return await provision(getToolVersion(ktlintVersion));
}

export {install};
