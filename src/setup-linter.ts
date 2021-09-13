import * as tc from '@actions/tool-cache';
import * as core from '@actions/core';
import * as gh from '@actions/github';
import * as fs from 'fs';
import * as path from 'path';
import {HttpClient} from '@actions/http-client';

interface Release {
  tag_name: string; // eslint-disable-line camelcase
}

function buildDownloadUrl(version: string): string {
  return `https://github.com/pinterest/ktlint/releases/download/${version}/ktlint`;
}

async function getLatestVersion(): Promise<string> {
  const httpClient = new HttpClient('ktlint-check');
  const response = await httpClient.getJson<Release>(
    'https://api.github.com/repos/pinterest/ktlint/releases/latest',
  );

  const downloadUrl = response?.result?.tag_name;

  if (downloadUrl === undefined) {
    throw new Error(
      `Could not determine latest version: ${response.statusCode}`,
    );
  }

  return downloadUrl;
}

async function determineVersion(version: string): Promise<string> {
  if (version === 'latest' && gh.context.repo.owner === 'musichin') {
    return await getLatestVersion();
  }

  return version;
}

async function getOrDownload(version: string): Promise<string> {
  const cachedPath = tc.find('ktlint', version);
  if (cachedPath) {
    return cachedPath;
  }

  const downloadUrl = buildDownloadUrl(version);
  const downloadedFile = await tc.downloadTool(downloadUrl);
  return await tc.cacheFile(downloadedFile, 'ktlint', 'ktlint', version);
}

async function install(version: string): Promise<string> {
  const finalVersion = await determineVersion(version);
  const toolPath = await getOrDownload(finalVersion);
  const execPath = path.join(toolPath, 'ktlint');
  fs.chmodSync(execPath, '777');
  core.addPath(toolPath);
  return toolPath;
}

export {getLatestVersion, install};
