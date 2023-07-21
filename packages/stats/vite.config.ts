import { defineConfig } from "vite";

import * as packageJson from "./package.json";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.dependencies), ...Object.keys(packageJson.peerDependencies), /@loaders\/*/],
    },
    sourcemap: true,
  },
});
