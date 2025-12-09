import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      css: true,
      globals: true,
    },
    resolve: {
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.css'],
      alias: {
        // Mock CSS imports do Vuetify
        'vuetify/styles': fileURLToPath(new URL('./src/test-utils/vuetify-styles-mock.ts', import.meta.url)),
      },
    },
  }),
)
