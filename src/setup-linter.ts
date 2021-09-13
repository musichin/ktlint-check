import * as tc from '@actions/tool-cache';
import * as core from '@actions/core';
import * as gh from '@actions/github';
import * as fs from 'fs';
import * as path from 'path';
import {HttpClient} from '@actions/http-client';
import {Tool} from './types';

const TOOL_NAME = 'ktlint';
const TOOL_FILENAME = TOOL_NAME;

interface Release {
  tag_name: string; // eslint-disable-line camelcase
}

function createTool(directory: string, version: string): Tool {
  return {
    name: TOOL_NAME,
    filename: TOOL_FILENAME,
    version,
    directory,
    path: path.join(directory, TOOL_FILENAME),
  };
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

async function getOrDownload(version: string): Promise<Tool> {
  const cachedPath = tc.find(TOOL_NAME, version);
  if (cachedPath) {
    return createTool(cachedPath, version);
  }

  const downloadUrl = buildDownloadUrl(version);
  const downloadedFile = await tc.downloadTool(downloadUrl);
  const path = await tc.cacheFile(
    downloadedFile,
    TOOL_FILENAME,
    TOOL_NAME,
    version,
  );
  return createTool(path, version);
}

async function install(version: string): Promise<Tool> {
  const finalVersion = await determineVersion(version);
  const tool = await getOrDownload(finalVersion);
  fs.chmodSync(tool.path, '777');
  core.addPath(tool.directory);
  return tool;
}

export {getLatestVersion, install};
