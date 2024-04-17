import react from '@vitejs/plugin-react';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { resolve } from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    assetsInclude: ['**/*.bmp'],
    resolve: {
      alias: {
        api: resolve('src/renderer/api/index.ts'),
        app: resolve('src/renderer/app'),
        assets: resolve('src/renderer/assets'),
        audio: resolve('src/renderer/audio/index.ts'),
        components: resolve('src/renderer/components'),
        hooks: resolve('src/renderer/hooks'),
        main: resolve('src/renderer/main'),
        queries: resolve('src/renderer/queries/index.ts'),
        routes: resolve('src/renderer/routes'),
        scripts: resolve('src/renderer/scripts'),
        state: resolve('src/renderer/state/index.ts'),
        typescript: resolve('src/typescript/index.ts'),
        ui: resolve('src/renderer/ui'),
      },
    },
    plugins: [react(), nodePolyfills()],
  },
});
