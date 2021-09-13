import * as tc from '@actions/tool-cache';
import {Tool} from './types';
import * as path from 'path';

const TOOL_VERSION = '1.0.0';
const TOOL_NAME = 'ktlint-github-reporter';
const TOOL_FILENAME = `${TOOL_NAME}.jar`;

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
  return `https://github.com/musichin/ktlint-github-reporter/releases/download/${version}/${TOOL_FILENAME}`;
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

async function install(): Promise<Tool> {
  return await getOrDownload(TOOL_VERSION);
}

export {install};
