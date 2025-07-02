import * as path from 'node:path';
import * as tc from '@actions/tool-cache';
import type { Tool } from './types';

function createTool(
  name: string,
  directory: string,
  version: string,
  fileName: string,
): Tool {
  return {
    name: name,
    filename: fileName,
    version,
    directory,
    path: path.join(directory, fileName),
  };
}

async function findOrDownload(
  name: string,
  version: string,
  downloadUrl: string,
  fileName: string,
): Promise<string> {
  const path = tc.find(name, version);
  if (path) {
    return path;
  }

  const downloadedFile = await tc.downloadTool(downloadUrl);
  return await tc.cacheFile(downloadedFile, fileName, name, version);
}

async function getOrDownload(
  name: string,
  version: string,
  downloadUrl: string,
  fileName: string,
): Promise<Tool> {
  const path = await findOrDownload(name, version, downloadUrl, fileName);
  return createTool(name, path, version, fileName);
}

export { getOrDownload };
