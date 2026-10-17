import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts'],
    env: {
      RUNNER_TOOL_CACHE: resolve(import.meta.dirname, 'test/cache'),
      RUNNER_TEMP: resolve(import.meta.dirname, 'test/temp'),
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
    },
  },
});
