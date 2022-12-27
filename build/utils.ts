import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import type { ViteEnv } from "/#/config";

export function isDevFn(mode: string): boolean {
  return mode === "development";
}

export function isProdFn(mode: string): boolean {
  return mode === "production";
}

/**
 * Whether to generate package preview
 */
export function isReportMode(): boolean {
  return process.env.REPORT === "true";
}

// Read all environment variable configuration files to process.env
export function wrapperEnv(envConf: Record<string, any>): ViteEnv {
  const ret: any = {};

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, "\n");
    realName = realName === "true" ? true : realName === "false" ? false : realName;

    if (envName === "VITE_PORT") {
      realName = Number(realName);
    }
    if (envName === "VITE_PROXY" && realName) {
      try {
        realName = JSON.parse(realName.replace(/'/g, '"'));
      } catch (error) {
        realName = "";
      }
    }
    ret[envName] = realName;
    if (typeof realName === "string") {
      process.env[envName] = realName;
    } else if (typeof realName === "object") {
      process.env[envName] = JSON.stringify(realName);
    }
  }
  return ret;
}

/**
 * 获取当前环境下生效的配置文件名
 */
function getConfFiles() {
  const script = process.env.npm_lifecycle_script;
  const reg = new RegExp("--mode ([a-z_\\d]+)");
  const result = reg.exec(script as string) as any;
  if (result) {
    const mode = result[1] as string;
    return [".env", `.env.${mode}`];
  }
  return [".env", ".env.production"];
}

/**
 * Get the environment variables starting with the specified prefix
 * @param match prefix
 * @param confFiles ext
 */
export function getEnvConfig(match = "VITE_GLOB_", confFiles = getConfFiles()) {
  let envConfig = {};
  confFiles.forEach((item) => {
    try {
      const env = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), item)));
      envConfig = { ...envConfig, ...env };
    } catch (e) {
      console.error(`Error in parsing ${item}`, e);
    }
  });
  const reg = new RegExp(`^(${match})`);
  Object.keys(envConfig).forEach((key) => {
    if (!reg.test(key)) {
      Reflect.deleteProperty(envConfig, key);
    }
  });
  return envConfig;
}

/**
 * Get user root directory
 * @param dir file path
 */
export function getRootPath(...dir: string[]) {
  return path.resolve(process.cwd(), ...dir);
}

/**
 * @description 获取 uniapp 当前编译平台，详情见 https://uniapp.dcloud.net.cn/tutorial/platform.html
 */
export function getUniPlatform() {
  const platform = {
    main: "WEB",
    detail: "WEB",
  };

  // #ifdef APP-PLUS || APP-PLUS-NVUE || APP-NVUE || APP-ANDROID || APP-IOS
  platform.main = "APP";
  platform.detail = "APP";
  // #endif
  // #ifdef APP-PLUS
  platform.detail = "APP-PLUS";
  // #endif
  // #ifdef APP-PLUS-NVUE
  platform.detail = "APP-PLUS-NVUE";
  // #endif
  // #ifdef APP-NVUE
  platform.detail = "APP-NVUE";
  // #endif
  // #ifdef APP-ANDROID
  platform.detail = "APP-ANDROID";
  // #endif
  // #ifdef APP-IOS
  platform.detail = "APP-IOS";
  // #endif

  // #ifdef H5
  platform.main = "H5";
  platform.detail = "H5";
  // #endif

  // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-LARK || MP-QQ || MP-KUAISHOU || MP-JD || MP-360 || MP
  platform.main = "MP";
  platform.detail = "MP";
  // #endif
  // #ifdef MP-WEIXIN
  platform.detail = "MP-WEIXIN";
  // #endif
  // #ifdef MP-ALIPAY
  platform.detail = "MP-ALIPAY";
  // #endif
  // #ifdef MP-BAIDU
  platform.detail = "MP-BAIDU";
  // #endif
  // #ifdef MP-TOUTIAO
  platform.detail = "MP-TOUTIAO";
  // #endif
  // #ifdef MP-LARK
  platform.detail = "MP-LARK";
  // #endif
  // #ifdef MP-QQ
  platform.detail = "MP-QQ";
  // #endif
  // #ifdef MP-KUAISHOU
  platform.detail = "MP-KUAISHOU";
  // #endif
  // #ifdef MP-JD
  platform.detail = "MP-JD";
  // #endif
  // #ifdef MP-360
  platform.detail = "MP-360";
  // #endif

  // #ifdef QUICKAPP-WEBVIEW-UNION || QUICKAPP-WEBVIEW-HUAWEI || QUICKAPP-WEBVIEW
  platform.main = "QUICKAPP-WEBVIEW";
  platform.detail = "QUICKAPP-WEBVIEW";
  // #endif
  // #ifdef QUICKAPP-WEBVIEW-UNION
  platform.detail = "QUICKAPP-WEBVIEW-UNION";
  // #endif
  // #ifdef QUICKAPP-WEBVIEW-HUAWEI
  platform.detail = "QUICKAPP-WEBVIEW-HUAWEI";
  // #endif

  return platform;
}
