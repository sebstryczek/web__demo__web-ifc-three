import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineConfig } from "vite";

const PRODUCTION = "production";
const STAGING = "staging";
const DEVELOPMENT = "development";

export default defineConfig(({ command, mode, ssrBuild }) => {
  console.log(
    `[vite.config.js] command: ${command}, mode: ${mode}, ssrBuild: ${ssrBuild}`,
  );

  const isProduction = mode === PRODUCTION;
  const isStaging = mode === STAGING;
  const isDevelopment = mode === DEVELOPMENT;

  return {
    plugins: [basicSsl()],
    server: {
      host: true,
      port: 3001,
    },
    build: {
      assetsDir: "./assets",
    },
    base: isStaging ? "/web__demo__web-ifc-three/" : "/",
  };
});
