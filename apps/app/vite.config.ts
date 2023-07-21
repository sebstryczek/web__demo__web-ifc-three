import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineConfig } from "vite";

export default defineConfig(({ command, mode, ssrBuild }) => {
  console.log(`[vite.config.js] command: ${command}, mode: ${mode}, ssrBuild: ${ssrBuild}`);

  return {
    plugins: [basicSsl()],
    server: {
      host: true,
      port: 3001,
    },
  };
});
