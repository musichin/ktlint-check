import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import * as tc from '@actions/tool-cache';
import { getOrDownload } from '../src/tool-provisioner';

vi.mock('@actions/tool-cache', () => ({
  find: vi.fn(),
  downloadTool: vi.fn(),
  cacheFile: vi.fn(),
}));

const NAME = 'tool';
const VERSION = '1.0.0';
const URL = 'download-url';
const FILENAME = 'tool.jar';
const CACHE_DIR = '/cache/tool/1.0.0';

// sha256 of "content"
const SHA256 = 'ed7002b439e9ac845f22357d822bac1444730fbdb6016d3ec9432297b9ec9f73';

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'tool-provisioner-'));
}

function createCachedDir(): string {
  const cachedDir = createTempDir();
  fs.writeFileSync(path.join(cachedDir, FILENAME), 'content');
  return cachedDir;
}

describe('#tool-provisioner', () => {
  describe('#getOrDownload', () => {
    let downloadedFile: string;

    beforeEach(() => {
      vi.clearAllMocks();
      downloadedFile = path.join(createTempDir(), 'download');
      fs.writeFileSync(downloadedFile, 'content');
      vi.mocked(tc.find).mockReturnValue('');
      vi.mocked(tc.downloadTool).mockResolvedValue(downloadedFile);
      vi.mocked(tc.cacheFile).mockResolvedValue(CACHE_DIR);
    });

    test('cached', async () => {
      const cachedDir = createCachedDir();
      vi.mocked(tc.find).mockReturnValue(cachedDir);

      const tool = await getOrDownload(NAME, VERSION, URL, FILENAME, SHA256);

      expect(tool.path).toStrictEqual(path.join(cachedDir, FILENAME));
      expect(tc.downloadTool).not.toHaveBeenCalled();
    });

    test('cached checksum mismatch', async () => {
      const cachedDir = createTempDir();
      fs.writeFileSync(path.join(cachedDir, FILENAME), 'corrupted');
      vi.mocked(tc.find).mockReturnValue(cachedDir);

      const tool = await getOrDownload(NAME, VERSION, URL, FILENAME, SHA256);

      expect(tool.path).toStrictEqual(path.join(CACHE_DIR, FILENAME));
      expect(tc.downloadTool).toHaveBeenCalledWith(URL);
      expect(tc.cacheFile).toHaveBeenCalledWith(downloadedFile, FILENAME, NAME, VERSION);
    });

    test('cached file missing', async () => {
      vi.mocked(tc.find).mockReturnValue(createTempDir());

      const tool = await getOrDownload(NAME, VERSION, URL, FILENAME, SHA256);

      expect(tool.path).toStrictEqual(path.join(CACHE_DIR, FILENAME));
      expect(tc.downloadTool).toHaveBeenCalledWith(URL);
      expect(tc.cacheFile).toHaveBeenCalledWith(downloadedFile, FILENAME, NAME, VERSION);
    });

    test('cached without checksum', async () => {
      const cachedDir = createTempDir();
      vi.mocked(tc.find).mockReturnValue(cachedDir);

      const tool = await getOrDownload(NAME, VERSION, URL, FILENAME);

      expect(tool.path).toStrictEqual(path.join(cachedDir, FILENAME));
      expect(tc.downloadTool).not.toHaveBeenCalled();
    });

    test('checksum match', async () => {
      const tool = await getOrDownload(NAME, VERSION, URL, FILENAME, SHA256);

      expect(tool.path).toStrictEqual(path.join(CACHE_DIR, FILENAME));
      expect(tc.cacheFile).toHaveBeenCalledWith(downloadedFile, FILENAME, NAME, VERSION);
    });

    test('checksum mismatch', async () => {
      await expect(getOrDownload(NAME, VERSION, URL, FILENAME, '0'.repeat(64))).rejects.toThrow(
        `Checksum mismatch for ${NAME}:${VERSION}@sha256:${'0'.repeat(64)}`,
      );

      expect(tc.cacheFile).not.toHaveBeenCalled();
      expect(fs.existsSync(downloadedFile)).toBe(false);
    });

    test('no checksum', async () => {
      await getOrDownload(NAME, VERSION, URL, FILENAME);

      expect(tc.cacheFile).toHaveBeenCalledWith(downloadedFile, FILENAME, NAME, VERSION);
    });
  });
});
