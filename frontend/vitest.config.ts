import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    execArgv: process.versions.node.split('.')[0] >= '25' ? ['--no-webstorage'] : [],
  },
});
