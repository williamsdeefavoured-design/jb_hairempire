// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: "vercel",
  },
  // Additional Vite rollup options to reduce noisy warnings and improve chunking on Vercel
  vite: {
    build: {
      // Raise the chunk size warning limit to avoid noisy warnings for large bundles
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        // Create a simple vendor chunk for node_modules to improve chunking
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules')) return 'vendor';
          },
        },
        // Silence specific unused-external-import warnings coming from TanStack packages
        onwarn(warning, warn) {
          // Rollup uses code 'UNUSED_EXTERNAL_IMPORT' for these warnings
          if (warning && warning.code === 'UNUSED_EXTERNAL_IMPORT' && /@tanstack\//.test(warning.message || '')) {
            return;
          }
          warn(warning);
        },
      },
    },
  },
});
