import { createHash } from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as tc from '@actions/tool-cache';
import type { Tool } from './types.js';

function createTool(name: string, directory: string, version: string, fileName: string): Tool {
  return {
    name: name,
    filename: fileName,
    version,
    directory,
    path: path.join(directory, fileName),
  };
}

async function computeSha256(file: string): Promise<string> {
  const hash = createHash('sha256');
  for await (const chunk of fs.createReadStream(file)) {
    hash.update(chunk);
  }
  return hash.digest('hex');
}

async function matchesSha256(file: string, expected: string): Promise<boolean> {
  return (await computeSha256(file)) === expected.toLowerCase();
}

async function verifySha256(file: string, name: string, version: string, expected: string): Promise<void> {
  if (!(await matchesSha256(file, expected))) {
    throw new Error(`Checksum mismatch for ${name}:${version}@sha256:${expected}`);
  }
}

async function isCachedFileValid(file: string, expected: string): Promise<boolean> {
  try {
    return await matchesSha256(file, expected);
  } catch {
    return false;
  }
}

async function findOrDownload(
  name: string,
  version: string,
  downloadUrl: string,
  fileName: string,
  sha256?: string,
): Promise<string> {
  const cachedDir = tc.find(name, version);
  if (cachedDir && (sha256 === undefined || (await isCachedFileValid(path.join(cachedDir, fileName), sha256)))) {
    return cachedDir;
  }

  const downloadedFile = await tc.downloadTool(downloadUrl);
  if (sha256 !== undefined) {
    try {
      await verifySha256(downloadedFile, name, version, sha256);
    } catch (error) {
      await fs.promises.rm(downloadedFile, { force: true });
      throw error;
    }
  }
  return await tc.cacheFile(downloadedFile, fileName, name, version);
}

async function getOrDownload(
  name: string,
  version: string,
  downloadUrl: string,
  fileName: string,
  sha256?: string,
): Promise<Tool> {
  const path = await findOrDownload(name, version, downloadUrl, fileName, sha256);
  return createTool(name, path, version, fileName);
}

export { getOrDownload };
