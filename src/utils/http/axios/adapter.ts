import { isFunction } from "../../types";
import type { CreateAxiosOptions } from "/#/axios";

const getResponse = (res: any, config: any) => {
  const { statusCode, errMsg, header } = res;
  const response = {
    ...res,
    headers: header,
    status: statusCode,
    statusText: errMsg,
    config,
    request: null,
  };

  return response;
};

export function uniAdapter<T = any>(options: CreateAxiosOptions) {
  if (!uni) {
    throw new Error("please use this in uni-app project!");
  }

  const { url, data, params, timeout, headers, transform } = options;

  const { requestCatchHook, transformRequestHook } = transform || {};

  return new Promise((resolve, reject) => {
    // const { timeout, headers } = options;
    // const { url, data, params } = conf;
    const uniConfig = {
      ...options,
      header: headers,
    } as any;

    if (data || params) {
      try {
        uniConfig.data = JSON.parse(data || params);
      } catch (e) {
        uniConfig.data = data || params;
      }
    }
    uni.request({
      ...uniConfig,
      success(_res) {
        const res = getResponse(_res, options);
        // if (transformRequestHook && isFunction(transformRequestHook)) {
        //   try {
        //     const ret = transformRequestHook(res, options.requestOptions!);
        //     resolve(ret);
        //   } catch (err) {
        //     reject(err || new Error("request error!"));
        //   }
        //   return;
        // }
        resolve(res as unknown as Promise<T>);
      },
      fail(_res) {
        const res = getResponse(_res, options);
        // if (requestCatchHook && isFunction(requestCatchHook)) {
        //   reject(requestCatchHook(e, options.requestOptions!));
        //   return;
        // }
        // // if (axios.isAxiosError(e)) {
        // //   // rewrite error message from axios in here
        // // }
        reject(res);
      },
    });
  });
}
