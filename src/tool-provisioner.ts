import * as path from 'path';
import * as tc from '@actions/tool-cache';
import {Tool} from './types';

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

async function getOrDownload(
  name: string,
  version: string,
  downloadUrl: string,
  fileName: string,
): Promise<Tool> {
  let path = tc.find(name, version);

  if (!path) {
    const downloadedFile = await tc.downloadTool(downloadUrl);
    path = await tc.cacheFile(downloadedFile, fileName, name, version);
  }

  return createTool(name, path, version, fileName);
}

export {getOrDownload};
