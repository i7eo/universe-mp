import { resolve } from "path";
import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

function pathResolve(dir: string) {
  return resolve(process.cwd(), ".", dir);
}

// https://vitejs.dev/config/
export default defineConfig({
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
  plugins: [uni()],
});
