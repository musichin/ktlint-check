import * as core from '@actions/core';
import * as gh from '@actions/github';
import * as fs from 'fs';
import {HttpClient} from '@actions/http-client';
import {Tool} from './types';
import {getOrDownload} from './tool-provisioner';

const TOOL_NAME = 'ktlint';
const TOOL_FILENAME = TOOL_NAME;

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

async function provision(version: string): Promise<Tool> {
  return getOrDownload(
    TOOL_NAME,
    version,
    buildDownloadUrl(version),
    TOOL_FILENAME,
  );
}

async function install(version: string): Promise<Tool> {
  const finalVersion = await determineVersion(version);
  const tool = await provision(finalVersion);
  fs.chmodSync(tool.path, '777');
  core.addPath(tool.directory);
  return tool;
}

export {getLatestVersion, install};
