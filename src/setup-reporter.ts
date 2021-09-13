import * as tc from '@actions/tool-cache';
import * as core from '@actions/core';

const KTLINT_GITHUB_VERSION = '1.0.0';

function buildDownloadUrl(version: string): string {
  return `https://github.com/musichin/ktlint-github-reporter/releases/download/${version}/ktlint-github-reporter.jar`;
}

async function getOrDownload(version: string): Promise<string> {
  const cachedPath = tc.find('ktlint-github-reporter.jar', version);
  if (cachedPath) {
    return cachedPath;
  }

  const downloadUrl = buildDownloadUrl(version);
  const downloadedFile = await tc.downloadTool(downloadUrl);
  return await tc.cacheFile(
    downloadedFile,
    'ktlint-github-reporter.jar',
    'ktlint-github-reporter',
    version,
  );
}

async function install(): Promise<string> {
  const toolPath = await getOrDownload(KTLINT_GITHUB_VERSION);
  core.addPath(toolPath);
  return toolPath;
}

export {install};
