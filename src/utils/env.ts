import { PlatformEnum } from "/@/enums/platform";
import type { GlobEnvConfig } from "/#/config";

/**
 * Get the configuration file variable name
 * @param env
 */
export const getConfigFileName = (env: Record<string, any>) => {
  return `__PRODUCTION__${env.VITE_GLOB_APP_SHORT_NAME || "__APP"}__CONF__`
    .toUpperCase()
    .replace(/\s/g, "");
};

export function getCommonStoragePrefix() {
  const { VITE_GLOB_APP_SHORT_NAME } = getAppEnvConfig();
  return `${VITE_GLOB_APP_SHORT_NAME}__${getEnv()}`.toUpperCase();
}

// Generate cache key according to version
export function getStorageShortName() {
  // return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase();
  return "";
}

export function getAppEnvConfig() {
  const ENV_NAME = getConfigFileName(import.meta.env);

  const ENV = (import.meta.env.DEV
    ? // Get the global configuration (the configuration will be extracted independently when packaging)
      (import.meta.env as unknown as GlobEnvConfig)
    : window[ENV_NAME as any]) as unknown as GlobEnvConfig;

  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
    VITE_GLOB_APP_ID,
    VITE_GLOB_MAIN_APP_ID,
    VITE_USE_MOCK,
  } = ENV;

  // eslint-disable-next-line no-useless-escape
  if (!/^[a-zA-Z\_]*$/.test(VITE_GLOB_APP_SHORT_NAME)) {
    console.warn(
      `VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`
    );
  }

  return {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
    VITE_GLOB_APP_ID,
    VITE_GLOB_MAIN_APP_ID,
    VITE_USE_MOCK,
  };
}

/**
 * @description: Development mode
 */
export const devMode = "development";

/**
 * @description: Production mode
 */
export const prodMode = "production";

/**
 * @description: Get environment variables
 * @returns:
 * @example:
 */
export function getEnv(): string {
  return import.meta.env.MODE;
}

/**
 * @description: Is it a development mode
 * @returns:
 * @example:
 */
export function isDevMode(): boolean {
  return import.meta.env.DEV;
}

/**
 * @description: Is it a production mode
 * @returns:
 * @example:
 */
export function isProdMode(): boolean {
  return import.meta.env.PROD;
}

/**
 * @description 平台环境
 */
export function uniPlatform() {
  let platform = PlatformEnum.WEB;

  /* #ifdef VUE3 */
  platform = PlatformEnum.VUE3;
  /* #endif */

  /* #ifdef APP-PLUS */
  platform = PlatformEnum.APP_PLUS;
  /* #endif */

  /* #ifdef APP-PLUS-NVUE */
  platform = PlatformEnum.APP_PLUS_NVUE;
  /* #endif */

  /* #ifdef APP-NVUE */
  platform = PlatformEnum.APP_NVUE;
  /* #endif */

  /* #ifdef H5 */
  platform = PlatformEnum.H5;
  /* #endif */

  /* #ifdef MP */
  platform = PlatformEnum.MP;
  /* #endif */

  /* #ifdef MP-WEIXIN */
  platform = PlatformEnum.MP_WEIXIN;
  /* #endif */

  /* #ifdef MP-ALIPAY */
  platform = PlatformEnum.MP_ALIPAY;
  /* #endif */

  /* #ifdef MP_BAIDU */
  platform = PlatformEnum.MP_BAIDU;
  /* #endif */

  /* #ifdef MP-TOUTIAO */
  platform = PlatformEnum.MP_TOUTIAO;
  /* #endif */

  /* #ifdef MP-LARK */
  platform = PlatformEnum.MP_LARK;
  /* #endif */

  /* #ifdef MP-QQ */
  platform = PlatformEnum.MP_QQ;
  /* #endif */

  /* #ifdef MP-KUAISHOU */
  platform = PlatformEnum.MP_KUAISHOU;
  /* #endif */

  /* #ifdef MP-JD */
  platform = PlatformEnum.MP_JD;
  /* #endif */

  /* #ifdef MP-360 */
  platform = PlatformEnum.MP_360;
  /* #endif */

  /* #ifdef QUICKAPP-WEBVIEW */
  platform = PlatformEnum.QUICKAPP_WEBVIEW;
  /* #endif */

  /* #ifdef QUICKAPP-WEBVIEW-UNION */
  platform = PlatformEnum.QUICKAPP_WEBVIEW_UNION;
  /* #endif */

  /* #ifdef QUICKAPP-WEBVIEW-HUAWEI */
  platform = PlatformEnum.QUICKAPP_WEBVIEW_HUAWEI;
  /* #endif */

  return platform;
}
