import { TOKEN_KEY } from "/@/enums/cache";

export function getToken() {
  return getCache(TOKEN_KEY);
}

export function getCache<T>(key: string) {
  let cache = "";

  try {
    const value = uni.getStorageSync(key);
    if (value) {
      cache = value;
    }
  } catch (e) {
    console.error(e);
    cache = "";
  }

  return (cache ? JSON.parse(cache) : "") as T;
}

export function setCache(key: string, value: any): boolean {
  let cache = "";
  let success = false;

  try {
    cache = JSON.stringify(value);
    uni.setStorageSync(key, cache);
    success = true;
  } catch (e) {
    console.error(e);
    cache = "";
    success = false;
  }

  return success;
}
