import { MicroServiceDomain } from "/@/enums/domain";
import { defHttp } from "/@/utils/http";
import type { definitions as TIANTA_SYSTEM_MODEL } from "../models/TIANTA-SYSTEM";
import type { ErrorMessageMode } from "/#/axios";

enum Api {
  USER_ENCRYPT = `login/getKey`,
  USER_LOGIN = `login/enter`,
  USER_LOGOUT = `login/out`,
  USER_INFO = `current/user/getInfo`,
  USER_INFO_LATEST = `current/user/getInfoRefresh`,
  USER_MENU = `current/user/sysMenu`,
  USER_ROLES = `current/user/roles`,
  LOGIN_SENDCODEMSG = `login/sendCodeMsg`, //发送验证码短信
  LOGIN_ENTERBYCODE = `login/enterByCode`, //验证码登录
  LOGIN_FOGETPWD_SENDCODE = `login/forgetpwd/sendCode`, // 忘记密码-发送验证码
  LOGIN_FORGETPWD_VERIFY = `login/forgetpwd/verify`, // 忘记密码-验证验证码
  LOGIN_FORGETPWD_RESETPWD = `login/forgetpwd/resetpwd`, // 忘记密码-重置密码
  USER_TOKEN_VALID = `current/user/valid`,
}

export const API__USER_ENCRYPT = () => {
  return defHttp.post<TIANTA_SYSTEM_MODEL["ResultEntity«LoginKeyVo»"]>({
    url: `/${MicroServiceDomain.TIANTA_SYSTEM}/${Api.USER_ENCRYPT}?_t=${new Date().getTime()}`,
  });
};

export const API__USER_LOGIN = (
  params: TIANTA_SYSTEM_MODEL["LoginDto"],
  mode: ErrorMessageMode = "modal"
) => {
  return defHttp.post<TIANTA_SYSTEM_MODEL["ResultEntity«object»"]>(
    {
      url: `/${MicroServiceDomain.TIANTA_SYSTEM}/${Api.USER_LOGIN}?_t=${new Date().getTime()}`,
      data: params,
    },
    {
      errorMessageMode: mode,
    }
  );
};

export const API__USER_LOGOUT = () => {
  return defHttp.post<TIANTA_SYSTEM_MODEL["ResultEntity«object»"]>({
    url: `/${MicroServiceDomain.TIANTA_SYSTEM}/${Api.USER_LOGOUT}?_t=${new Date().getTime()}`,
  });
};

export const API__USER_INFO = () => {
  return defHttp.post<TIANTA_SYSTEM_MODEL["ResultEntity«CurrentUserInfo»"]>({
    url: `/${MicroServiceDomain.TIANTA_SYSTEM}/${Api.USER_INFO}?_t=${new Date().getTime()}`,
  });
};

export const API__USER_INFO_LATEST = () => {
  return defHttp.post<TIANTA_SYSTEM_MODEL["ResultEntity«CurrentUserInfo»"]>({
    url: `/${MicroServiceDomain.TIANTA_SYSTEM}/${Api.USER_INFO_LATEST}?_t=${new Date().getTime()}`,
  });
};

export const API__USER_MENU = () => {
  return defHttp.post<TIANTA_SYSTEM_MODEL["ResultEntity«List«AclTreeVo»»"]>({
    url: `/${MicroServiceDomain.TIANTA_SYSTEM}/${Api.USER_MENU}?_t=${new Date().getTime()}`,
  });
};

export const API__USER_ROLES = () => {
  return defHttp.post<TIANTA_SYSTEM_MODEL["ResultEntity«Collection«string»»"]>({
    url: `/${MicroServiceDomain.TIANTA_SYSTEM}/${Api.USER_ROLES}?_t=${new Date().getTime()}`,
  });
};

export const API__LOGIN_SENDCODEMSG = (phone: string) => {
  return defHttp.post<TIANTA_SYSTEM_MODEL["ResultEntity«string»"]>({
    url: `/${MicroServiceDomain.TIANTA_SYSTEM}/${Api.LOGIN_SENDCODEMSG}/${phone}`,
  });
};

export const API__LOGIN_ENTERBYCODE = (params: TIANTA_SYSTEM_MODEL["LoginCodeDto"]) => {
  return defHttp.post<TIANTA_SYSTEM_MODEL["ResultEntity«object»"]>({
    url: `/${MicroServiceDomain.TIANTA_SYSTEM}/${Api.LOGIN_ENTERBYCODE}`,
    data: params,
  });
};

export const API__USER_FORGOT_GETCODE = (phone: string) => {
  return defHttp.post<TIANTA_SYSTEM_MODEL["ResultEntity«string»"]>({
    url: `/${MicroServiceDomain.TIANTA_SYSTEM}/${Api.LOGIN_FOGETPWD_SENDCODE}/${phone}`,
  });
};

export const API__USER_VALIDATE_CODE = (params: TIANTA_SYSTEM_MODEL["LoginCodeDto"]) => {
  return defHttp.post<TIANTA_SYSTEM_MODEL["ResultEntity«boolean»"]>({
    url: `/${MicroServiceDomain.TIANTA_SYSTEM}/${Api.LOGIN_FORGETPWD_VERIFY}`,
    data: params,
  });
};
export const API__USER_RESTE_PASSWORD = (params: TIANTA_SYSTEM_MODEL["ForgetPwdDto"]) => {
  return defHttp.post<TIANTA_SYSTEM_MODEL["ResultEntity«boolean»"]>({
    url: `/${MicroServiceDomain.TIANTA_SYSTEM}/${Api.LOGIN_FORGETPWD_RESETPWD}`,
    data: params,
  });
};
export const API__USER_TOKEN_VALID = () => {
  return defHttp.post({
    url: `/${MicroServiceDomain.TIANTA_SYSTEM}/${Api.USER_TOKEN_VALID}?_t=${new Date().getTime()}`,
  });
};
