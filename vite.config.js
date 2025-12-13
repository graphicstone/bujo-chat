import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Library mode: output as UMD/ESM for CDN, import, or script usage
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/UiLibraryWidgetEntry.jsx'),
      name: 'UiLibraryAssistant',
      fileName: (format) => `ui-library-assistant.${format}.js`,
      formats: ['umd', 'es'],
    },
    rollupOptions: {
      // Externalize React to avoid bundling it for host (host site must provide react)
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    outDir: 'dist-widget', // Avoid clobbering normal app builds
    emptyOutDir: true,
    minify: true
  },
});
