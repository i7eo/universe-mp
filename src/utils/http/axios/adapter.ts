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

  const { data, params, headers } = options;

  return new Promise((resolve, reject) => {
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
        resolve(res as unknown as Promise<T>);
      },
      fail(_res) {
        const res = getResponse(_res, options);
        reject(res);
      },
    });
  });
}
