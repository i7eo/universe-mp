import type { GlobConfig } from "/#/config";
import { getAppEnvConfig } from "/@/utils/env";

export const useGlobSetting = (): Readonly<GlobConfig> => {
  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
    VITE_GLOB_APP_ID,
    VITE_GLOB_MAIN_APP_ID,
    VITE_USE_MOCK,
  } = getAppEnvConfig();

  // eslint-disable-next-line no-useless-escape
  if (!/[a-zA-Z\_]*/.test(VITE_GLOB_APP_SHORT_NAME)) {
    console.warn(
      `VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`
    );
  }

  // Take global configuration
  const glob: Readonly<GlobConfig> = {
    title: VITE_GLOB_APP_TITLE,
    apiUrl: VITE_GLOB_API_URL,
    shortName: VITE_GLOB_APP_SHORT_NAME,
    urlPrefix: VITE_GLOB_API_URL_PREFIX,
    uploadUrl: VITE_GLOB_UPLOAD_URL,
    appId: VITE_GLOB_APP_ID,
    mainAppId: VITE_GLOB_MAIN_APP_ID,
    isMock: VITE_USE_MOCK === "true" ? true : false,
  };
  return glob as Readonly<GlobConfig>;
};
