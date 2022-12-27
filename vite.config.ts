import { resolve } from "path";
import { loadEnv } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { wrapperEnv } from "./build/utils";
// import { createProxy } from "./build/vite/proxy";
import pkg from "./package.json";
import type { ConfigEnv, UserConfig } from "vite";

function pathResolve(dir: string) {
  return resolve(process.cwd(), ".", dir);
}

function createAppInfo() {
  const { dependencies, devDependencies, name, version, description, packageManager } = pkg;
  return {
    pkg: { dependencies, devDependencies, name, version, description, packageManager },
    lastBuildTimeStamp: new Date().getTime(),
  };
}

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  const isBuild = command === "build";
  const root = process.cwd();
  const env = loadEnv(mode, root);
  // The boolean type read by loadEnv is a string. This function can be converted to boolean type
  const viteEnv = wrapperEnv(env);
  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY } = viteEnv;

  console.log(`env is build: ${isBuild}`);
  console.log(`vite proxy: ${JSON.stringify(VITE_PROXY)}`);

  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias: [
        {
          find: /\/@\//,
          replacement: `${pathResolve("src")}/`,
        },
        {
          find: /\/#\//,
          replacement: `${pathResolve("typings")}/`,
        },
      ],
    },
    server: {
      // Listening on all local IPs
      host: true,
      port: VITE_PORT,
      // // Load proxy configuration from .env
      // proxy: createProxy(VITE_PROXY),
    },
    plugins: [uni()],
    define: {
      // Suppress warning
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(createAppInfo()),
    },
  };
};
